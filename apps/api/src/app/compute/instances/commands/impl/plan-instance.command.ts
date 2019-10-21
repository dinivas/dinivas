import { InstanceDTO, ConsulDTO } from '@dinivas/dto';

export class PlanInstanceCommand {
  constructor(
    public readonly instance: InstanceDTO,
    public readonly consul: ConsulDTO,
    public readonly cloudConfig: any
  ) {}
}
