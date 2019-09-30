import { ConsulDTO } from '@dinivas/dto';

export class PlanConsulCommand {
  constructor(
    public readonly consul: ConsulDTO,
    public readonly cloudConfig: any
  ) {}
}
