import { App, Stack } from '@aws-cdk/core'

import { MLBBackendStackProps } from '../utils/interfaces'
import { MLBBackendDDB } from '../infrastructure/dynamodb/dynamodb'
import { MLBBackendLambda } from '../infrastructure/lambda/lambda'

export class MLBBackendStack extends Stack {

  public readonly props: MLBBackendStackProps
  constructor(scope: App, id: string, props: MLBBackendStackProps) {
    super(scope, id, props)
    this.props = props

    const lambda = new MLBBackendLambda(this)
    const ddb = new MLBBackendDDB(this)
  }
}
