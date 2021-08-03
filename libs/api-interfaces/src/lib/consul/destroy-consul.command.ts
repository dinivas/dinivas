import { ConsulDTO } from './consul.dto';

export class DestroyConsulCommand {
  constructor(
    public readonly cloudprovider: string,
    public readonly consul: ConsulDTO,
    public readonly projectConsul: ConsulDTO,
    public readonly cloudConfig: any
  ) {}

  static from<T extends DestroyConsulCommand>(json: T): DestroyConsulCommand {
    return new DestroyConsulCommand(
      json.cloudprovider,
      json.consul,
      json.projectConsul,
      json.cloudConfig
    );
  }
}
