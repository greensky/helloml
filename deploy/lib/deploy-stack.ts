import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import { DockerImageAsset } from '@aws-cdk/aws-ecr-assets';
import * as ecs_patterns from '@aws-cdk/aws-ecs-patterns';
import {Schedule} from '@aws-cdk/aws-events';
import { InstanceType, NatInstanceProvider, NatProvider, InstanceClass, InstanceSize } from '@aws-cdk/aws-ec2';

export class HelloMLDeployStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'HelloMlVPC', {
      cidr: "10.0.0.0/16",
      natGatewayProvider: NatProvider.instance({
        instanceType: InstanceType.of(InstanceClass.BURSTABLE3, InstanceSize.MICRO)
      })
    });  

    // The code that defines your stack goes here
    new s3.Bucket(this, 'Temp-HelloMLDataBucket', {
      versioned: true    
    });

    const asset = new DockerImageAsset(this, 'HelloMlImage', {
      directory: "../docker",
      file: "Dockerfile.cpu"
    });    

    // Create an ECS cluster
    const cluster = new ecs.Cluster(this, 'Cluster', {
      vpc,
    });

    // Instantiate an Amazon EC2 Task to run at a scheduled interval
    const ecsScheduledTask = new ecs_patterns.ScheduledEc2Task(this, 'ScheduledTask', {
      cluster,
      scheduledEc2TaskImageOptions: {
        image: ecs.ContainerImage.fromRegistry(asset.imageUri),
        memoryLimitMiB: 256,
        environment: { name: 'TRIGGER', value: 'CloudWatch Events' },
      },
      schedule: Schedule.expression('rate(1 hour)')
    });
  }
}
