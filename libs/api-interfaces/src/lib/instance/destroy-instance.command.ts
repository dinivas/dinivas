import { ConsulDTO } from './../consul/consul.dto';
import { InstanceDTO } from './instance.dto';

export class DestroyInstanceCommand {
  constructor(
    public readonly cloudprovider: string,
    public readonly instance: InstanceDTO,
    public readonly consul: ConsulDTO,
    public readonly cloudConfig: any
  ) {}

  static from<T extends DestroyInstanceCommand>(
    json: T
  ): DestroyInstanceCommand {
    return new DestroyInstanceCommand(
      json.cloudprovider,
      json.instance,
      json.consul,
      json.cloudConfig
    );
  }
}
