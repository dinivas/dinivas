export interface IServerInfo {
  version?: string;
  gitCommit?: string;
}

export class ServerInfo implements IServerInfo {
  constructor(public version?: string, public gitCommit?: string) {
    this.version = version;
    this.gitCommit = gitCommit;
  }
}
