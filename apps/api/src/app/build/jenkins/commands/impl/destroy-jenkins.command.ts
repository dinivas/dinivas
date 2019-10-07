import { JenkinsDTO, ConsulDTO } from '@dinivas/dto';

export class DestroyJenkinsCommand {
  constructor(
    public readonly jenkins: JenkinsDTO,
    public readonly consul: ConsulDTO,
    public readonly cloudConfig: any
  ) {}
}
