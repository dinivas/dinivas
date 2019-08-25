import { JenkinsDTO } from '@dinivas/dto';

export class ApplyJenkinsCommand {
  constructor(
    public readonly jenkins: JenkinsDTO,
    public readonly workingDir: string
  ) {}
}
