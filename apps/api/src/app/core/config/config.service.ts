import { Injectable, Logger } from '@nestjs/common';
import { IConfig } from 'config';
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
    this.checkWorkspacePath();
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

  private checkWorkspacePath() {
    var fs = require('fs');
    var dir = this.getWorkspaceRootPath();

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  }
}
