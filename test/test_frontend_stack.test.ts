import { App } from '@aws-cdk/core'
import { Capture, Match, Template } from '@aws-cdk/assertions';
import { expect, haveResource, haveResourceLike } from '@aws-cdk/assert'

import { MLBFrontendStack } from '../lib/stacks/frontend_stack'

const app = new App()
let stack: MLBFrontendStack
let template: Template

beforeAll(() => {
  stack = new MLBFrontendStack(app, 'mockFrontendStack', {
    region: 'us-east-1',
    stage: 'devo',
    stackName: 'mockFrontendStack',
    terminationProtection: false
  })
  template = Template.fromStack(stack)
})

describe('While creating Frontend Infrastructure', () => {
  it('should have Lambda resources defined', () => {
    template.hasResourceProperties('AWS::Lambda::Function', {
      Handler: 'handler.main',
      Runtime: 'nodejs14.x',
    })

    template.hasResourceProperties('AWS::IAM::Role', {
      'AssumeRolePolicyDocument': {
        'Statement': [
          {
            'Action': 'sts:AssumeRole',
            'Effect': 'Allow',
            'Principal': {
              'Service': 'lambda.amazonaws.com'
            }
          }
        ],
        'Version': '2012-10-17'
      }
    })
  })

  it('should have APIGateway resources defined', () => {
    template.hasResourceProperties('AWS::Logs::LogGroup', {
      'RetentionInDays': 731
    })

    template.hasResourceProperties('AWS::ApiGateway::RestApi', {
      'EndpointConfiguration': {
        'Types': [
          'REGIONAL'
        ]
      },
      'Name': 'MLBFrontendApi'
    })

    template.hasResourceProperties('AWS::IAM::Role', {
      'AssumeRolePolicyDocument': {
        'Statement': [
          {
            'Action': 'sts:AssumeRole',
            'Effect': 'Allow',
            'Principal': {
              'Service': 'apigateway.amazonaws.com'
            }
          }
        ],
        'Version': '2012-10-17'
      }
    })

    template.hasResourceProperties('AWS::ApiGateway::Stage', {
      'AccessLogSetting': {
        'Format': "{\"requestId\":\"$context.requestId\",\"ip\":\"$context.identity.sourceIp\",\"user\":\"$context.identity.user\",\"caller\":\"$context.identity.caller\",\"requestTime\":\"$context.requestTime\",\"httpMethod\":\"$context.httpMethod\",\"resourcePath\":\"$context.resourcePath\",\"status\":\"$context.status\",\"protocol\":\"$context.protocol\",\"responseLength\":\"$context.responseLength\"}"
      },
      'Description': 'APIGateway Stage',
      'MethodSettings': [
        {
          'DataTraceEnabled': false,
          'HttpMethod': '*',
          'LoggingLevel': 'INFO',
          'MetricsEnabled': true,
          'ResourcePath': '/*',
          'ThrottlingBurstLimit': 20,
          'ThrottlingRateLimit': 20
        }
      ],
      'StageName': 'devo'
    })

    template.hasResourceProperties('AWS::ApiGateway::Method', {
      'HttpMethod': 'GET',
      'AuthorizationType': 'NONE',
      'Integration': {
        'IntegrationHttpMethod': 'POST',
        'RequestTemplates': {
          "application/json": "{ \"statusCode\": \"200\" }"
        },
        'Type': 'AWS_PROXY'
      }
    })

    template.resourceCountIs('AWS::ApiGateway::Account', 1)
    template.resourceCountIs('AWS::ApiGateway::Deployment', 1)
  })
})
