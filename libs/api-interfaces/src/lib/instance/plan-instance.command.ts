import { ConsulDTO } from './../consul/consul.dto';
import { InstanceDTO } from './instance.dto';

export class PlanInstanceCommand {
  constructor(
    public readonly cloudprovider: string,
    public readonly instance: InstanceDTO,
    public readonly consul: ConsulDTO,
    public readonly cloudConfig: any
  ) {}

  static from<T extends PlanInstanceCommand>(json: T): PlanInstanceCommand {
    return new PlanInstanceCommand(
      json.cloudprovider,
      json.instance,
      json.consul,
      json.cloudConfig
    );
  }
}
