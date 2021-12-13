import { App } from '@aws-cdk/core'
import { Capture, Match, Template } from '@aws-cdk/assertions';
import { expect, haveResource, haveResourceLike } from '@aws-cdk/assert'

import { MLBBackendStack } from '../lib/stacks/backend_stack'

const app = new App()
let stack: MLBBackendStack
let template: Template

beforeAll(() => {
  stack = new MLBBackendStack(app, 'mockBackendStack', {
    region: 'us-east-1',
    stage: 'devo',
    stackName: 'mockBackendStack',
    terminationProtection: false
  })
  template = Template.fromStack(stack)
})

describe('While creating Backend Infrastructure', () => {
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

  it('should have DDB resources defined', () => {
    template.hasResourceProperties('AWS::DynamoDB::Table', {
      'KeySchema': [
        {
          'AttributeName': 'id',
          'KeyType': 'HASH'
        },
        {
          'AttributeName': 'team',
          'KeyType': 'RANGE'
        }
      ],
      'AttributeDefinitions': [
        {
          'AttributeName': 'id',
          'AttributeType': 'S'
        },
        {
          'AttributeName': 'team',
          'AttributeType': 'S'
        },
        {
          'AttributeName': 'playerName',
          'AttributeType': 'S'
        },
        {
          'AttributeName': 'playerTeam',
          'AttributeType': 'S'
        },
        {
          'AttributeName': 'playerPosition',
          'AttributeType': 'S'
        }
      ],
      'GlobalSecondaryIndexes': [
        {
          'IndexName': 'player-team',
          'KeySchema': [
            {
              'AttributeName': 'playerName',
              'KeyType': 'HASH'
            },
            {
              'AttributeName': 'playerTeam',
              'KeyType': 'RANGE'
            }
          ],
          'Projection': {
            'ProjectionType': 'KEYS_ONLY'
          },
          'ProvisionedThroughput': {
            'ReadCapacityUnits': 5,
            'WriteCapacityUnits': 5
          }
        },
        {
          'IndexName': 'player-position',
          'KeySchema': [
            {
              'AttributeName': 'playerName',
              'KeyType': 'HASH'
            },
            {
              'AttributeName': 'playerPosition',
              'KeyType': 'RANGE'
            }
          ],
          'Projection': {
            'ProjectionType': 'KEYS_ONLY'
          },
          'ProvisionedThroughput': {
            'ReadCapacityUnits': 5,
            'WriteCapacityUnits': 5
          }
        }
      ],
      'ProvisionedThroughput': {
        'ReadCapacityUnits': 5,
        'WriteCapacityUnits': 5
      },
      'StreamSpecification': {
        'StreamViewType': 'NEW_AND_OLD_IMAGES'
      }
    })

    template.hasResourceProperties('AWS::DynamoDB::Table', {
      'KeySchema': [
        {
          'AttributeName': 'id',
          'KeyType': 'HASH'
        },
        {
          'AttributeName': 'hitDate',
          'KeyType': 'RANGE'
        }
      ],
      'AttributeDefinitions': [
        {
          'AttributeName': 'id',
          'AttributeType': 'S'
        },
        {
          'AttributeName': 'hitDate',
          'AttributeType': 'S'
        },
        {
          'AttributeName': 'playerName',
          'AttributeType': 'S'
        },
        {
          'AttributeName': 'playerTeam',
          'AttributeType': 'S'
        }
      ],
      'GlobalSecondaryIndexes': [
        {
          'IndexName': 'hits-team',
          'KeySchema': [
            {
              'AttributeName': 'playerName',
              'KeyType': 'HASH'
            },
            {
              'AttributeName': 'playerTeam',
              'KeyType': 'RANGE'
            }
          ],
          'Projection': {
            'ProjectionType': 'ALL'
          },
          'ProvisionedThroughput': {
            'ReadCapacityUnits': 5,
            'WriteCapacityUnits': 5
          }
        }
      ],
      'ProvisionedThroughput': {
        'ReadCapacityUnits': 5,
        'WriteCapacityUnits': 5
      },
      'StreamSpecification': {
        'StreamViewType': 'NEW_AND_OLD_IMAGES'
      }
    })
  })
})
