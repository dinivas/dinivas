import { Injectable, Logger } from '@nestjs/common';
import { IConfig } from 'config';

import { ITerraformModuleInfo } from '@dinivas/dto';
if (!process.env['NODE_CONFIG_DIR']) {
  process.env['NODE_CONFIG_DIR'] = __dirname + '/../../../config/';
}
export const config: IConfig = require('config');
const path = require('path');

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
  get(_path: string) {
    return config.get(`${this.configRootPrefix}.${_path}`);
  }

  getKeycloakConfig() {
    return this.get('keycloak.config');
  }

  getWorkspaceRootPath(): string {
    return this.get('workspace.root-path');
  }

  private checkRequiredPath() {
    const fs = require('fs');
    [this.getWorkspaceRootPath(), this.getTerraformModulesRootPath()].forEach(
      _path => {
        if (!fs.existsSync(_path)) {
          fs.mkdirSync(_path);
        }
      }
    );
  }

  getTerraformModules() {
    return this.get('terraform.modules') as ITerraformModuleInfo[];
  }

  getTerraformModulesRootPath() {
    return `${path.join(this.getWorkspaceRootPath(), 'terraform_modules')}`;
  }
}
