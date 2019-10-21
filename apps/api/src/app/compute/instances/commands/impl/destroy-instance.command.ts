import { InstanceDTO, ConsulDTO } from '@dinivas/dto';

export class DestroyInstanceCommand {
  constructor(
    public readonly instance: InstanceDTO,
    public readonly consul: ConsulDTO,
    public readonly cloudConfig: any
  ) {}
}
