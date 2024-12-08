import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import * as ecs from 'aws-cdk-lib/aws-ecs'
import * as ecs_patterns from 'aws-cdk-lib/aws-ecs-patterns'
import * as rds from 'aws-cdk-lib/aws-rds'
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager'

import * as path from 'path'

export class IacStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)
    
    const vpc = new ec2.Vpc(this, 'Vpc', {
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
      vpc,
    })

    const dbPassword = new secretsmanager.Secret(this, 'MoodBoardDbPassword', {
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ username: 'postgres' }),
        excludePunctuation: true,
        includeSpace: false,
        generateStringKey: 'password',
        passwordLength: 30,
      },
    })

    const dbInstance = new rds.DatabaseInstance(this, 'MoodBoardRDS', {
      engine: rds.DatabaseInstanceEngine.POSTGRES,
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.BURSTABLE3,
        ec2.InstanceSize.SMALL
      ),
      vpc,
      credentials: rds.Credentials.fromSecret(dbPassword),
      databaseName: 'moodboard',
      allocatedStorage: 20,
      securityGroups: [new ec2.SecurityGroup(this, 'RdsSecurityGroup', { vpc })],
      subnetGroup: new rds.SubnetGroup(this, 'MoodBoardRdsSubnetGroup', {
        vpc,
        description: 'Subnets for MoodBoard RDS instance',
      }),
      publiclyAccessible: false,
    })
    
    new ecs_patterns.ApplicationLoadBalancedFargateService(this, 'MoodBoardService', {
      cluster,
      cpu: 512,
      desiredCount: 1,
      memoryLimitMiB: 2048,
      publicLoadBalancer: true,
      taskImageOptions: {
        image: ecs.ContainerImage.fromAsset(path.join(__dirname, '../../')),
        containerPort: +(process.env.PORT!),
        containerName: 'mood-board-container',
        environment: {
          DB_HOST: dbInstance.dbInstanceEndpointAddress,
          DB_PORT: '5432',
          POSTGRES_USERNAME: 'postgres',
          POSTGRES_DB: 'moodboard',
          POSTGRES_PASSWORD: dbPassword.secretValue.unsafeUnwrap(),
          NODE_ENV: 'production'
        },
      },
    })
  }
}

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