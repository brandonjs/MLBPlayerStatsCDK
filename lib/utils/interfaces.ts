
export enum LOGICAL_STAGE_NAMES {
  DEVO = 'devo',
  PREPROD = 'preProd',
  PROD = 'prod'
}

export interface Account {
  accountId: string
  emailAddress: string
  partition: string
}

export interface Accounts {
  accounts: { [key: string]: { [key: string]: Account }}
}

export interface MLBStackProps {
  readonly region: string
  readonly stage: string
  readonly stackName?: string
  readonly terminationProtection?: boolean
}

export interface MLBFrontendStackProps extends MLBStackProps {
}

export interface MLBBackendStackProps extends MLBStackProps {
}
