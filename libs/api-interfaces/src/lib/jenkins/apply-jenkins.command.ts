import { JenkinsDTO } from './jenkins.dto';

export class ApplyJenkinsCommand {
  constructor(
    public readonly cloudprovider: string,
    public readonly jenkins: JenkinsDTO,
    public readonly workingDir: string
  ) {}

  static from<T extends ApplyJenkinsCommand>(json: T): ApplyJenkinsCommand {
    return new ApplyJenkinsCommand(
      json.cloudprovider,
      json.jenkins,
      json.workingDir
    );
  }
}
