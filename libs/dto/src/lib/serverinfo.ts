export interface IGitInfo {
  branch: string;
  sha: string;
  abbreviatedSha: string
}
export interface IServerInfo {
  version?: string;
  gitInfo?: IGitInfo;
  terraform?: ITerraformInfo;
}

export interface ITerraformModuleInfo {
  name: string;
  type: string;
  provider: string;
  url: string;
}

export interface ITerraformInfo {
  modules: ITerraformModuleInfo[];
}


export interface IPackerModuleInfo {
  name: string;
  type: string;
  url: string;
}

export class ServerInfo implements IServerInfo {
  constructor(public version?: string, public gitInfo?: IGitInfo, public terraform?: ITerraformInfo) {
    this.version = version;
    this.gitInfo = gitInfo;
    this.terraform = terraform;
  }
}
