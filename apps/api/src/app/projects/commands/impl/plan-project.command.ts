export class PlanProjectCommand {
  constructor(
    public readonly projectName: string,
    public readonly projectCode: string,
    public readonly projectDescription: string,
    public readonly public_router: string,
    public readonly floating_ip_pool: string,
    public readonly enableMonitoring: boolean,
    public readonly enableLogging: boolean,
    public readonly loggingStack: string,
    public readonly cloudConfig: any
  ) {}
}
