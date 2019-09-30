import { ConsulDTO } from '@dinivas/dto';

export class DestroyConsulCommand {
  constructor(
    public readonly consul: ConsulDTO,
    public readonly cloudConfig: any
  ) {}
}
