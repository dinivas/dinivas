import { InstanceDTO } from './instance.dto';

export class ApplyInstanceCommand {
  constructor(
    public readonly cloudprovider: string,
    public readonly instance: InstanceDTO,
  ) {}

  static from<T extends ApplyInstanceCommand>(json: T): ApplyInstanceCommand {
    return new ApplyInstanceCommand(
      json.cloudprovider,
      json.instance,
    );
  }
}
