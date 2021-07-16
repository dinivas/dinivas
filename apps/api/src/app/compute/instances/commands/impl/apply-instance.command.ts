import { InstanceDTO } from '@dinivas/api-interfaces';

export class ApplyInstanceCommand {
  constructor(
    public readonly cloudprovider: string,
    public readonly instance: InstanceDTO,
    public readonly workingDir: string
  ) {}
}
