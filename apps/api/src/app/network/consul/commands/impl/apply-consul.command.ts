import { ConsulDTO } from '@dinivas/api-interfaces';

export class ApplyConsulCommand {
  constructor(
    public readonly consul: ConsulDTO,
    public readonly workingDir: string
  ) {}
}
