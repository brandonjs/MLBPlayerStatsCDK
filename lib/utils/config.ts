export class Config {
  public static readonly SERVICE_NAME = "mlbPlayerStats"
  public static readonly DEPLOYMENT_REGIONS: string[] = ['us-east-1', 'us-west-2', 'eu-west-1']

  public static readonly TEST_STAGES: string[] = ['devo']
  public static readonly PRE_PROD_STAGES: string[] = ['preProd']
  public static readonly PROD_STAGES: string[] = ['prod']

  public static readonly APIG_RATE_LIMIT = 20
  public static readonly APIG_BURST_LIMIT = 20
}
