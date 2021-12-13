import { Code, Function, Runtime } from '@aws-cdk/aws-lambda'

import { LogGroup } from '@aws-cdk/aws-logs'

import { Config } from '../../utils/config'
import { MLBFrontendStack } from '../../stacks/frontend_stack'

export class MLBFrontendLambda {

  public readonly frontendLambda: Function

  constructor(stack: MLBFrontendStack) {
    this.frontendLambda = new Function(stack, 'FrontendLambdaHandler', {
      runtime: Runtime.NODEJS_14_X,
      code: Code.fromAsset('resources/frontend'),
      handler: 'handler.main'
    })
  }
}

export class MLBBackendLambda {

  public readonly backendLambda: Function

  constructor(stack: MLBFrontendStack) {
    this.backendLambda = new Function(stack, 'BancendLambdaHandler', {
      runtime: Runtime.NODEJS_14_X,
      code: Code.fromAsset('resources/backend'),
      handler: 'handler.main'
    })
  }
}
