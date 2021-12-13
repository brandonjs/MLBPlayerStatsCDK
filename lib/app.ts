import { App } from '@aws-cdk/core'

import { Config } from './utils/config'
import { Accounts, LOGICAL_STAGE_NAMES } from './utils/interfaces'
import { genStack, getAccounts } from './utils/functions'

const app = new App()

let accounts: Accounts = getAccounts()

Object.keys(LOGICAL_STAGE_NAMES).forEach(s => {
  let stage = LOGICAL_STAGE_NAMES[s]
  let regions = Object.keys(accounts)
    .filter(key => key.startsWith(stage))
    .map(key => { return key.split('.', 2)[1] })
 if (!regions.length) return
  genStack(app, regions, stage)
})
