import { Injectable, Logger } from '@nestjs/common';

import { ITerraformModuleInfo } from '@dinivas/api-interfaces';
import { ConfigService } from '@nestjs/config';
if (!process.env['NODE_CONFIG_DIR']) {
  process.env['NODE_CONFIG_DIR'] = __dirname + '/../../../config/';
}

import path = require('path');

import fileSystem = require('fs');
import os = require('os');
const homeDirectory = os.homedir();
const dinivasWorkspaceDirectory = homeDirectory + '/.dinivas/workspace';
if (!fileSystem.existsSync(dinivasWorkspaceDirectory)) {
  fileSystem.mkdirSync(dinivasWorkspaceDirectory, { recursive: true });
}

type TfModule = {
  name: string;
  type: string;
  provider: string;
  url: string;
};
@Injectable()
export class ConfigurationService {
  configRootPrefix = 'dinivas';

  constructor(private configService: ConfigService) {
    this.checkRequiredPath();
  }
  get(_path: string) {
    return this.configService.get(`${this.configRootPrefix}.${_path}`);
  }

  getOrElse(_path: string, defaultValue: unknown) {
    const computedPath = `${this.configRootPrefix}.${_path}`;
    return this.configService.get(computedPath) != undefined
      ? this.configService.get(computedPath)
      : defaultValue;
  }

  getKeycloakConfig() {
    return this.get('keycloak.config');
  }

  getWorkspaceRootPath(): string {
    return dinivasWorkspaceDirectory;
  }

  private checkRequiredPath() {
    const fs = fileSystem;
    [this.getWorkspaceRootPath(), this.getTerraformModulesRootPath()].forEach(
      (_path) => {
        if (!fs.existsSync(_path)) {
          fs.mkdirSync(_path);
        }
      }
    );
  }

  getTerraformModuleSource(
    moduleId: 'project_base' | 'jenkins' | 'rabbitmq' | 'project_instance' | 'consul',
    cloudproviderId: 'openstack' | 'digitalocean'
  ): string {
    return this.configService
      .get<TfModule[]>(`${this.configRootPrefix}.terraform.modules`)
      .filter(
        (module) =>
          module.provider === cloudproviderId && module.name === moduleId
      )
      .map((m) => m.url)[0];
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
}
