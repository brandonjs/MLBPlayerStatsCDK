import { App, Stack } from '@aws-cdk/core'

import { MLBFrontendStackProps } from '../utils/interfaces'

import { MLBFrontendAPIGateway } from '../infrastructure/apigateway/api_gateway'
import { MLBFrontendLambda } from '../infrastructure/lambda/lambda'

export class MLBFrontendStack extends Stack {

  public readonly props: MLBFrontendStackProps
  constructor(scope: App, id: string, props: MLBFrontendStackProps) {
    super(scope, id, props)
    this.props = props

    const lambda = new MLBFrontendLambda(this)
    new MLBFrontendAPIGateway(this, lambda)
  }
}
