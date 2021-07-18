import { ProjectDTO, ConsulDTO } from '@dinivas/api-interfaces';

export class PlanProjectCommand {
  constructor(
    public readonly cloudprovider: string,
    public readonly project: ProjectDTO,
    public readonly projectName: string,
    public readonly projectCode: string,
    public readonly projectDescription: string,
    public readonly public_router: string,
    public readonly floating_ip_pool: string,
    public readonly enableMonitoring: boolean,
    public readonly enableLogging: boolean,
    public readonly loggingStack: string,
    public readonly cloudConfig: any,
    public readonly consul: ConsulDTO
  ) {}

  static from<T extends PlanProjectCommand>(json: T): PlanProjectCommand {
    return new PlanProjectCommand(
      json.cloudprovider,
      json.project,
      json.projectName,
      json.projectCode,
      json.projectDescription,
      json.public_router,
      json.floating_ip_pool,
      json.enableMonitoring,
      json.enableLogging,
      json.loggingStack,
      json.cloudConfig,
      json.consul
    );
  }
}
