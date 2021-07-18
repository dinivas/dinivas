import { ConsulDTO } from './consul.dto';

export class PlanConsulCommand {
  constructor(
    public readonly cloudprovider: string,
    public readonly consul: ConsulDTO,
    public readonly cloudConfig: any
  ) {}
}
