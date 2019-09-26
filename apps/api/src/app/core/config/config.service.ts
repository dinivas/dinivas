import { Injectable, Logger } from '@nestjs/common';
import { IConfig } from 'config';

import { ITerraformModuleInfo, IPackerModuleInfo } from '@dinivas/dto';
if (!process.env['NODE_CONFIG_DIR']) {
  process.env['NODE_CONFIG_DIR'] = __dirname + '/../../../config/';
}
export const config: IConfig = require('config');
console.log('NODE_CONFIG_DIR: ' + config.util.getEnv('NODE_CONFIG_DIR'));
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

  getOrElse(_path: string, defaultValue: any) {
    const computedPath = `${this.configRootPrefix}.${_path}`;
    return config.has(computedPath) ? config.get(computedPath) : defaultValue;
  }

  getKeycloakConfig() {
    return this.get('keycloak.config');
  }

  getWorkspaceRootPath(): string {
    return this.get('workspace.root-path');
  }

  private checkRequiredPath() {
    const fs = require('fs');
    [
      this.getWorkspaceRootPath(),
      this.getTerraformModulesRootPath(),
      this.getPackerModulesRootPath()
    ].forEach(_path => {
      if (!fs.existsSync(_path)) {
        fs.mkdirSync(_path);
      }
    });
  }

  getTerraformExecutable(): string {
    return this.getOrElse('terraform.executable', 'terraform') as string;
  }

  getTerraformModules() {
    return this.get('terraform.modules') as ITerraformModuleInfo[];
  }

  getTerraformModulesRootPath() {
    return `${path.join(this.getWorkspaceRootPath(), 'terraform_modules')}`;
  }

  getPackerModules() {
    return this.get('packer.modules') as IPackerModuleInfo[];
  }

  getPackerExecutable(): string {
    return this.getOrElse('packer.executable', 'packer') as string;
  }

  getPackerModulesRootPath() {
    return `${path.join(this.getWorkspaceRootPath(), 'packer_modules')}`;
  }
}
