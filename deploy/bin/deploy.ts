#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { HelloMLDeployStack } from '../lib/deploy-stack';

const app = new cdk.App();
new HelloMLDeployStack(app, 'HelloMLDeployStack', {
    env: {
        account: '145295549308',
        region: 'us-east-1'
    }
});
