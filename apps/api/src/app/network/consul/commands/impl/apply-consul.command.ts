import { ConsulDTO } from '@dinivas/dto';

export class ApplyConsulCommand {
  constructor(
    public readonly consul: ConsulDTO,
    public readonly workingDir: string
  ) {}
}
