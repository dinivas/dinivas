import { Injectable, Logger } from '@nestjs/common';
import { IConfig } from 'config';
import { ITerraformModuleInfo } from '@dinivas/dto';
if (!process.env['NODE_CONFIG_DIR']) {
  process.env['NODE_CONFIG_DIR'] = __dirname + '/../../../config/';
}
export const config: IConfig = require('config');

@Injectable()
export class ConfigService {
  private readonly logger = new Logger(ConfigService.name);
  configRootPrefix = 'dinivas';

  constructor() {
    this.logger.debug(
      `Load configuration ${JSON.stringify(config)} from path ${
        process.env['NODE_CONFIG_DIR']
      }`
    );
    this.checkRequiredPath();
  }
  get(path: string) {
    return config.get(`${this.configRootPrefix}.${path}`);
  }

  getKeycloakConfig() {
    return this.get('keycloak.config');
  }

  getWorkspaceRootPath(): string {
    return this.get('workspace.root-path');
  }

  private checkRequiredPath() {
    var fs = require('fs');
    [this.getWorkspaceRootPath(), this.getTerraformModulesRootPath()].forEach(
      path => {
        if (!fs.existsSync(path)) {
          fs.mkdirSync(path);
        }
      }
    );
  }

  getTerraformModules() {
    return this.get('terraform.modules') as ITerraformModuleInfo[];
  }

  getTerraformModulesRootPath() {
    return `${this.getWorkspaceRootPath()}/terraform_modules`;
  }
}
