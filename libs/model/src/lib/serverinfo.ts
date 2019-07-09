export interface IGitInfo {
  branch: string;
  sha: string;
  abbreviatedSha: string
}
export interface IServerInfo {
  version?: string;
  gitInfo?: IGitInfo;
}

export class ServerInfo implements IServerInfo {
  constructor(public version?: string, public gitInfo?: IGitInfo) {
    this.version = version;
    this.gitInfo = gitInfo;
  }
}
