import { ConfigService } from './../config/config.service';
import { Injectable, Logger } from '@nestjs/common';
import * as simplegit from 'simple-git/promise';
const fs = require('fs');

@Injectable()
export class GitService {
  private readonly logger = new Logger(GitService.name);

  simpleGit: any;

  constructor(private configService: ConfigService) {
    this.simpleGit = simplegit(
      this.configService.getTerraformModulesRootPath()
    );
    this.initTerraformModules();
  }

  initTerraformModules() {
    this.configService
      .getTerraformModules()
      .filter(m => m.type === 'git' && m.url)
      .forEach(module => {
        // Check if folder already exist
        if (
          !fs.existsSync(
            `${this.configService.getTerraformModulesRootPath()}/${module.name}`
          )
        ) {
          //clone
          this.simpleGit
            .clone(module.url, module.name, {})
            .then((err, result) => {
              if (err) {
                this.logger.error(err);
              }
              this.logger.debug(
                `Terraform module ${module.name} has been initialized from ${
                  module.url
                } into ${this.configService.getTerraformModulesRootPath()}/${
                  module.name
                }`
              );
            })
            .catch(err => this.logger.error(err));
        } else {
          const simpleGit = simplegit(
            `${this.configService.getTerraformModulesRootPath()}/${module.name}`
          );
          simpleGit.fetch('origin').then(fetchResult => {
            simpleGit.reset('hard');
          });
        }
      });
  }
}
