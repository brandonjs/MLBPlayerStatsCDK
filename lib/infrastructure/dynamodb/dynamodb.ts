import { AttributeType, BillingMode, ProjectionType, Table } from '@aws-cdk/aws-dynamodb'

import { LogGroup } from '@aws-cdk/aws-logs'

import { Config } from '../../utils/config'
import { MLBBackendStack } from '../../stacks/backend_stack'

export class MLBBackendDDB {

  constructor(stack: MLBBackendStack) {
    // Create a separate table for player stats as they rarely change.
    let playerStats = new Table(stack, 'PlayerStatsTable', {
      // id will be a hash of the player full name + date of birth.
      partitionKey: { name: 'id', type: AttributeType.STRING },
      sortKey: { name: 'team', type: AttributeType.STRING },
      replicationRegions: Config.DEPLOYMENT_REGIONS,
      billingMode: BillingMode.PROVISIONED,
    })

    playerStats.autoScaleWriteCapacity({
      minCapacity: 1,
      maxCapacity: 10,
    }).scaleOnUtilization({ targetUtilizationPercent: 75 })

    playerStats.addGlobalSecondaryIndex({
      indexName: 'player-team',
      partitionKey: { name: 'playerName', type: AttributeType.STRING },
      projectionType: ProjectionType.KEYS_ONLY,
      sortKey: { name: 'playerTeam', type: AttributeType.STRING }
    })

    playerStats.addGlobalSecondaryIndex({
      indexName: 'player-position',
      partitionKey: { name: 'playerName', type: AttributeType.STRING },
      projectionType: ProjectionType.KEYS_ONLY,
      sortKey: { name: 'playerPosition', type: AttributeType.STRING }
    })

    let playerHits = new Table(stack, 'PlayerHitsTable', {
      partitionKey: { name: 'id', type: AttributeType.STRING },
      sortKey: { name: 'hitDate', type: AttributeType.STRING },
      replicationRegions: Config.DEPLOYMENT_REGIONS,
      billingMode: BillingMode.PROVISIONED,
    })

    playerHits.autoScaleWriteCapacity({
      minCapacity: 1,
      maxCapacity: 10,
    }).scaleOnUtilization({ targetUtilizationPercent: 75 })

    playerHits.addGlobalSecondaryIndex({
      indexName: 'hits-team',
      partitionKey: { name: 'playerName', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
      sortKey: { name: 'playerTeam', type: AttributeType.STRING }
    })
  }
}
