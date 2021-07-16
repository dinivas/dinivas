import { JenkinsDTO } from '@dinivas/api-interfaces';

export class ApplyJenkinsCommand {
  constructor(
    public readonly cloudprovider: string,
    public readonly jenkins: JenkinsDTO,
    public readonly workingDir: string
  ) {}
}
