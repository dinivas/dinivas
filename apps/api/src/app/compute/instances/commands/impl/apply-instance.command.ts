import { InstanceDTO } from '@dinivas/dto';

export class ApplyInstanceCommand {
  constructor(
    public readonly instance: InstanceDTO,
    public readonly workingDir: string
  ) {}
}
