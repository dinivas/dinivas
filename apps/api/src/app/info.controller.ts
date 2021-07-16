import { AuthzGuard } from './auth/authz.guard';
import { ConfigurationService } from './core/config/configuration.service';
import {
  ServerInfo,
  IGitInfo,
  ITerraformInfo,
  ITerraformModuleInfo
} from '@dinivas/api-interfaces';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import getGitRepoInfo = require('git-repo-info');


@ApiTags('server-info')
@ApiBearerAuth()
@UseGuards(AuthzGuard)
@Controller('server-info')
export class InfoController {
  getGitRepoInfo: any;
  gitInfo: any;
  packageInfo: string;

  constructor(private configService: ConfigurationService) {
    this.gitInfo = getGitRepoInfo();
    const packageJson = {
      name: 'dinivas',
      version: '0.0.0'
    };
    this.packageInfo = `${packageJson.name}-${packageJson.version}`;
  }
  @Get()
  apiInfo(): any {
    return new ServerInfo(
      `${this.packageInfo}`,
      <IGitInfo>{
        branch: this.gitInfo.branch,
        sha: this.gitInfo.sha,
        abbreviatedSha: this.gitInfo.abbreviatedSha
      },
      <ITerraformInfo>{
        modules: this.configService.get(
          'terraform.modules'
        ) as ITerraformModuleInfo[]
      }
    );
  }
}
