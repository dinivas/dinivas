import { JenkinsDTO } from '@dinivas/dto';

export class DestroyJenkinsCommand {
  constructor(
    public readonly jenkins: JenkinsDTO,
    public readonly cloudConfig: any
  ) {}
}
