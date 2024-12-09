#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib'
import { MoodStack } from '../lib/iac-stack'

const app = new cdk.App()
new MoodStack(app, 'MoodStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
})