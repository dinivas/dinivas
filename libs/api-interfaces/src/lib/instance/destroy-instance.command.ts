import { InstanceDTO, ConsulDTO } from '@dinivas/api-interfaces';

export class DestroyInstanceCommand {
  constructor(
    public readonly cloudprovider: string,
    public readonly instance: InstanceDTO,
    public readonly consul: ConsulDTO,
    public readonly cloudConfig: any
  ) {}
}