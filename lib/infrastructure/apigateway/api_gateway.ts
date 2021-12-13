import apig = require('@aws-cdk/aws-apigateway')
import iam = require('@aws-cdk/aws-iam')

import { LogGroup } from '@aws-cdk/aws-logs'

import { Config } from '../../utils/config'
import { MLBFrontendStack } from '../../stacks/frontend_stack'
import { MLBFrontendLambda } from '../lambda/lambda'

export class MLBFrontendAPIGateway {

  public readonly restApi: apig.RestApi
  public readonly deployment: apig.Deployment

  constructor(stack: MLBFrontendStack, lambda: MLBFrontendLambda) {

    const apiGatewayPrincipals: iam.IPrincipal[] = [new iam.AccountPrincipal(stack.account)]

    const apiGatewayPolicyStatement = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['execute-api:Invoke'],
      principals: apiGatewayPrincipals ? apiGatewayPrincipals : undefined,
      resources: [`arn:${stack.partition}:execute-api:${stack.region}:${stack.account}:*/*`]
    })

    const logGroup = new LogGroup(stack, 'ApiGatewayAccessLogs');

    // Create a Rest API
    const restApi = new apig.RestApi(stack, 'MLBFrontendApi', {
      cloudWatchRole: true,
      deploy: true,
      deployOptions: {
        accessLogDestination: new apig.LogGroupLogDestination(logGroup),
        accessLogFormat: apig.AccessLogFormat.jsonWithStandardFields(),
        stageName: stack.props.stage,
        description: 'APIGateway Stage',
        loggingLevel: apig.MethodLoggingLevel.INFO,
        dataTraceEnabled: false,
        metricsEnabled: true,
        throttlingBurstLimit: Config.APIG_BURST_LIMIT,
        throttlingRateLimit: Config.APIG_RATE_LIMIT,
      },
      endpointConfiguration: { types: [apig.EndpointType.REGIONAL] },
      retainDeployments: true
    })

    const frontendLambdaIntegration = new apig.LambdaIntegration(lambda.frontendLambda, {
      requestTemplates: { "application/json": '{ "statusCode": "200" }' }
    })
    restApi.root.addMethod('GET', frontendLambdaIntegration) // GET /
  }

}
