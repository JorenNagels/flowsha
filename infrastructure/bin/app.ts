#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { FlowshaStack } from '../lib/flowsha-stack';

const app = new cdk.App();

new FlowshaStack(app, 'FlowshaHoopsStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    // London region for the UK site + SES.
    region: process.env.CDK_DEFAULT_REGION || 'eu-west-2',
  },
});
