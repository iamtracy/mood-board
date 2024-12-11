import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import * as ecs from 'aws-cdk-lib/aws-ecs'
import * as ecs_patterns from 'aws-cdk-lib/aws-ecs-patterns'
import * as rds from 'aws-cdk-lib/aws-rds'
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager'
import * as route53 from 'aws-cdk-lib/aws-route53'
import * as route53_targets from 'aws-cdk-lib/aws-route53-targets'
import * as acm from 'aws-cdk-lib/aws-certificatemanager'
import * as path from 'path'

const DOMAIN = 'is-mood.com'

export class MoodStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)
    
    const vpc = new ec2.Vpc(this, 'Vpc', {
      vpcName: 'mood-board-vpc',
      maxAzs: 2,
      natGateways: 1,
      subnetConfiguration: [
        {
          name: 'PublicSubnet',
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          name: 'PrivateSubnet',
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
      ],
    })

    const cluster = new ecs.Cluster(this, 'MoodBoardCluster', {
      clusterName: 'mood-board-cluster',
      vpc,
    })
    
    const dbPassword = new secretsmanager.Secret(this, 'MoodBoardDbPassword', {
      description: 'Password for the MoodBoard RDS instance',
      secretName: 'mood-board-db-password',
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ username: 'postgres' }),
        excludePunctuation: true,
        includeSpace: false,
        generateStringKey: 'password',
        passwordLength: 30,
      },
    })

    const dbSecurityGroup = new ec2.SecurityGroup(this, 'RdsSecurityGroup', {
      vpc,
      description: 'Allow communication from ECS tasks to PostgreSQL',
      securityGroupName: 'mood-board-rds-sg',
    })

    const engine = rds.DatabaseClusterEngine.auroraPostgres({
      version: rds.AuroraPostgresEngineVersion.VER_16_4,
    })
    const dbCluster = new rds.DatabaseCluster(this, 'MoodBoardAuroraCluster', {
      serverlessV2MaxCapacity: 1,
      serverlessV2MinCapacity: 0,
      instanceIdentifierBase: 'mood-board-instance',
      storageEncrypted: true,
      engine,
      writer: rds.ClusterInstance.serverlessV2('writer', {
        instanceIdentifier: 'mood-board-writer',
      }),
      readers: [
        rds.ClusterInstance.serverlessV2('reader', {
          scaleWithWriter: true,
          instanceIdentifier: 'mood-board-reader',
        }),
      ],
      credentials: rds.Credentials.fromSecret(dbPassword),
      defaultDatabaseName: 'moodboard',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      storageType: rds.DBClusterStorageType.AURORA_IOPT1,
      vpc,
      autoMinorVersionUpgrade: true,
      securityGroups: [dbSecurityGroup],
      vpcSubnets: vpc.selectSubnets({
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      }),
      parameterGroup: new rds.ParameterGroup(this, 'MoodBoardAuroraParameterGroup', {
        engine,
        description: 'Custom parameter group for the MoodBoard Aurora instance',
        name: 'mood-board-serverless-parameter-group',
        parameters: {
          log_statement: 'all',
          log_min_duration_statement: '0',
          'rds.force_ssl': '0',
        },
      }),
    })

    const ecsSecurityGroup = new ec2.SecurityGroup(this, 'MoodBoardServiceSG', {
      vpc,
      description: 'Allow communication from ECS tasks',
      securityGroupName: 'mood-board-ecs-sg',
    })
    
    dbSecurityGroup.addIngressRule(
      ecsSecurityGroup,
      ec2.Port.tcp(5432),
      'Allow ECS tasks to connect to PostgreSQL'
    )
    
    const moodBoardService = new ecs_patterns.ApplicationLoadBalancedFargateService(this, 'MoodBoardService', {
      serviceName: 'mood-board-service',
      certificate: acm.Certificate.fromCertificateArn(
        this,
        'MoodCertificate',
        process.env.CERTIFICATE_ARN ?? ''
      ),
      cluster,
      cpu: 512,
      securityGroups: [ecsSecurityGroup],
      loadBalancerName: 'mood-board-alb',
      desiredCount: 1,
      redirectHTTP: true,
      memoryLimitMiB: 2048,
      publicLoadBalancer: true,
      taskImageOptions: {
        image: ecs.ContainerImage.fromAsset(path.join(__dirname, '../../')),
        containerPort: 3000,
        containerName: 'mood-board-container',
        environment: {
          DB_HOST: dbCluster.clusterEndpoint.hostname,
          DB_PORT: dbCluster.clusterEndpoint.port.toString(),
          POSTGRES_USERNAME: 'postgres',
          POSTGRES_DB: 'moodboard',
          NODE_ENV: 'production'
        },
        secrets: {
          POSTGRES_PASSWORD: ecs.Secret.fromSecretsManager(dbPassword, 'password'),
        },
      },
    })

    moodBoardService.targetGroup.configureHealthCheck({
      path: '/api/health',
    })
  
    new route53.ARecord(this, 'AliasRecord', {
      recordName: 'staging',
      ttl: cdk.Duration.minutes(5),
      comment: 'DNS record for the MoodBoard service',
      target: route53.RecordTarget.fromAlias(
        new route53_targets.LoadBalancerTarget(moodBoardService.loadBalancer)
      ),
      zone: route53.HostedZone.fromLookup(this, 'HostedZone', {
        domainName: DOMAIN,
      }),
    })
  }
}