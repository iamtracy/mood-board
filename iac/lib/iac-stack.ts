import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import * as ecs from 'aws-cdk-lib/aws-ecs'
import * as ecs_patterns from 'aws-cdk-lib/aws-ecs-patterns'
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
  
    new ecs_patterns.ApplicationLoadBalancedFargateService(this, 'MoodBoardService', {
      cluster,
      cpu: 512,
      desiredCount: 6,
      memoryLimitMiB: 2048,
      publicLoadBalancer: true,
      taskImageOptions: {
        image: ecs.ContainerImage.fromAsset(
          path.join(__dirname, '../../'),
        ),
        containerPort: 3000,
        containerName: 'mood-board-container'
      },
    })
  }
}
