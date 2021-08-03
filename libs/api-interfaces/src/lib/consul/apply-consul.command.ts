import { ConsulDTO } from './consul.dto';

export class ApplyConsulCommand {
  constructor(
    public readonly cloudprovider: string,
    public readonly consul: ConsulDTO
  ) {}

  static from<T extends ApplyConsulCommand>(json: T): ApplyConsulCommand {
    return new ApplyConsulCommand(json.cloudprovider, json.consul);
  }
}
