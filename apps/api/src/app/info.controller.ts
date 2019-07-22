import { ServerInfo, IGitInfo } from '@dinivas/dto';
import { Roles } from './auth/roles.decorator';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthzGuard } from 'apps/api/src/app/auth/authz.guard';

@ApiUseTags('info')
@ApiBearerAuth()
@UseGuards(AuthzGuard)
@Controller('info')
export class InfoController {
  getGitRepoInfo: any;
  gitInfo: any;
  packageInfo: string;

  constructor() {
    const getGitRepoInfo = require('git-repo-info');
    this.gitInfo = getGitRepoInfo();
    const packageJson = {
      name: 'dinivas',
      version: '0.0.0'
    };
    this.packageInfo = `${packageJson.name}-${packageJson.version}`;
  }
  @Get()
  @Roles('admin')
  apiInfo(): any {
    return new ServerInfo(`${this.packageInfo}`, <IGitInfo>{
      branch: this.gitInfo.branch,
      sha: this.gitInfo.sha,
      abbreviatedSha: this.gitInfo.abbreviatedSha
    });
  }
}
