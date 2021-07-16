import { ConsulDTO } from '@dinivas/api-interfaces';

export class PlanConsulCommand {
  constructor(
    public readonly cloudprovider: string,
    public readonly consul: ConsulDTO,
    public readonly cloudConfig: any
  ) {}
}
