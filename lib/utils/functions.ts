import fs = require('fs')
import path = require('path')
import yaml = require('js-yaml')

import { Stack } from '@aws-cdk/core'

import { Config } from './config'
import { Accounts, MLBStackProps } from './interfaces'

import { MLBFrontendStack } from '../stacks/frontend_stack'
import { MLBBackendStack } from '../stacks/backend_stack'

export function getAccounts(): Accounts {
  return getConfigData('accounts')[Config.SERVICE_NAME]
}

export function getConfigData(configFileName: string): any {
  const configDir = './'
  const baseJsonPath = path.join(configDir, 'configuration', 'json')
  const baseYamlPath = path.join(configDir, 'configuration', 'yaml')

  if (fs.existsSync(path.join(baseJsonPath, `${configFileName}.json`))) {
    let constantsData = fs.readFileSync(path.join(baseJsonPath, `${configFileName}.json`))
    return JSON.parse(constantsData.toString())
  } else if (fs.existsSync(path.join(baseYamlPath, `${configFileName}.yml`))) {
    let constantsData = fs.readFileSync(path.join(baseYamlPath, `${configFileName}.yml`), 'utf-8')
    return yaml.safeLoad(constantsData.toString())
  } else {
    throw new Error(`Unable to find config data: ${configFileName} in JSON or YAML path`)
  }
}

export function genStack(app, regions: string[], stage: string): any {
  regions.forEach(region => {
    let stackSuffix = `${stage}-${region}`
    let terminationProtection = Config.TEST_STAGES.includes(stage) ? false : true
    let stackProps: MLBStackProps = {
      region: region,
      stage: stage,
      terminationProtection: terminationProtection
    }

    let frontendStack = new MLBFrontendStack(app, `FrontendStack-${stackSuffix}`, {
      ...stackProps,
      ...{
        stackName: `MLBFrontendStack-${stackSuffix}`
      }
    })
    let backendStack = new MLBBackendStack(app, `BackendStack-${stackSuffix}`, {
      ...stackProps,
      ...{
        stackName: `MLBBackendStack-${stackSuffix}`
      }
    })
  })
}

