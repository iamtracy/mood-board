import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import * as ecs from 'aws-cdk-lib/aws-ecs'
import * as ecs_patterns from 'aws-cdk-lib/aws-ecs-patterns'
import * as rds from 'aws-cdk-lib/aws-rds'
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager'
import * as acm from 'aws-cdk-lib/aws-certificatemanager'
import * as elb from 'aws-cdk-lib/aws-elasticloadbalancingv2'
import * as path from 'path'

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

    const rdsVersion = rds.DatabaseInstanceEngine.postgres({
      version: rds.PostgresEngineVersion.VER_17_2,
    })
    const parameterGroup = new rds.ParameterGroup(this, 'MoodBoardPostgresParameterGroup', {
      engine: rdsVersion,
      description: 'Custom parameter group for the MoodBoard RDS instance',
      name: 'mood-board-postgres-parameter-group',
      parameters: {
        log_statement: 'all',
        log_min_duration_statement: '0',
      },
    })
    parameterGroup.addParameter('rds.force_ssl', '0')

    const dbInstance = new rds.DatabaseInstance(this, 'MoodBoardRDS', {
      engine: rdsVersion,
      instanceIdentifier: 'mood-board-rds',
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T3,
        ec2.InstanceSize.MICRO,
      ),
      vpc,
      credentials: rds.Credentials.fromSecret(dbPassword),
      databaseName: 'moodboard',
      allocatedStorage: 20,
      securityGroups: [dbSecurityGroup],
      subnetGroup: new rds.SubnetGroup(this, 'MoodBoardRdsSubnetGroup', {
        vpc,
        description: 'Subnets for MoodBoard RDS instance',
      }),
      parameterGroup
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

    const certificate = new acm.Certificate(this, 'MoodBoardCertificate', {
      domainName: 'mood-board-alb-1053778799.us-east-1.elb.amazonaws.com',
      validation: acm.CertificateValidation.fromDns(),
    })
    
    const moodBoardService = new ecs_patterns.ApplicationLoadBalancedFargateService(this, 'MoodBoardService', {
      serviceName: 'mood-board-service',
      cluster,
      cpu: 512,
      certificate,
      securityGroups: [ecsSecurityGroup],
      loadBalancerName: 'mood-board-alb',
      desiredCount: 1,
      memoryLimitMiB: 2048,
      publicLoadBalancer: true,
      redirectHTTP: true,
      taskImageOptions: {
        image: ecs.ContainerImage.fromAsset(path.join(__dirname, '../../')),
        containerPort: 3000,
        containerName: 'mood-board-container',
        environment: {
          DB_HOST: dbInstance.dbInstanceEndpointAddress,
          DB_PORT: dbInstance.dbInstanceEndpointPort,
          POSTGRES_USERNAME: 'postgres',
          POSTGRES_DB: 'moodboard',
          NODE_ENV: 'production'
        },
        secrets: {
          POSTGRES_PASSWORD: ecs.Secret.fromSecretsManager(dbPassword, 'password'),
        },
      },
    })

    moodBoardService.loadBalancer.addListener('HttpsListener', {
      port: 443,
      certificates: [certificate],
      defaultAction: elb.ListenerAction.forward([moodBoardService.targetGroup]),
    })

    moodBoardService.targetGroup.configureHealthCheck({
      path: '/api/health',
    })
  }
}

// TODO: Add the following code to the MoodStack class once you have the domain set up
// import * as acm from 'aws-cdk-lib/aws-certificatemanager'
// import * as route53 from 'aws-cdk-lib/aws-route53'
// import * as route53_targets from 'aws-cdk-lib/aws-route53-targets'

// const domainName = process.env.DOMAIN!
// const subDomain = process.env.SUBDOMAIN!

// const certificate = new acm.Certificate(this, 'MoodBoardCertificate', {
//   domainName,
//   validation: acm.CertificateValidation.fromDns(),
// })

// const zone = route53.HostedZone.fromLookup(this, 'HostedZone', {
//   domainName,
// })
// albService.loadBalancer.addListener('Listener', {
//   port: 443,
//   certificates: [certificate],
// })

// new route53.ARecord(this, 'AliasRecord', {
//   recordName: subDomain,
//   target: route53.RecordTarget.fromAlias(new route53_targets.LoadBalancerTarget(albService.loadBalancer)),
//   zone,
// })