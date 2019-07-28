import { ConfigService } from './core/config/config.service';
import {
  ServerInfo,
  IGitInfo,
  ITerraformInfo,
  ITerraformModuleInfo
} from '@dinivas/dto';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthzGuard } from 'apps/api/src/app/auth/authz.guard';

@ApiUseTags('server-info')
@ApiBearerAuth()
@UseGuards(AuthzGuard)
@Controller('server-info')
export class InfoController {
  getGitRepoInfo: any;
  gitInfo: any;
  packageInfo: string;

  constructor(private configService: ConfigService) {
    const getGitRepoInfo = require('git-repo-info');
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
