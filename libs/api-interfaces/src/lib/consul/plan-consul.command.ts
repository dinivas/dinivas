import { ConsulDTO } from './consul.dto';

export class PlanConsulCommand {
  constructor(
    public readonly cloudprovider: string,
    public readonly consul: ConsulDTO,
    public readonly projectConsul: ConsulDTO,
    public readonly cloudConfig: any
  ) {}

  static from<T extends PlanConsulCommand>(json: T): PlanConsulCommand {
    return new PlanConsulCommand(
      json.cloudprovider,
      json.consul,
      json.projectConsul,
      json.cloudConfig
    );
  }
}
