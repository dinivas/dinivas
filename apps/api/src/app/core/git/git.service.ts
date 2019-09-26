import { ConfigService } from './../config/config.service';
import { Injectable, Logger } from '@nestjs/common';
import * as simplegit from 'simple-git/promise';
const fs = require('fs');
const path = require('path');

@Injectable()
export class GitService {
  private readonly logger = new Logger(GitService.name);

  simpleGit: any;

  constructor(private configService: ConfigService) {
    this.simpleGit = simplegit(
      this.configService.getTerraformModulesRootPath()
    );
    this.initTerraformModules();
    this.simpleGit = simplegit(this.configService.getPackerModulesRootPath());
    this.initPackerModules();
  }

  initTerraformModules() {
    this.configService
      .getTerraformModules()
      .filter(m => m.type === 'git' && m.url)
      .forEach(module => {
        // Check if folder already exist
        if (
          !fs.existsSync(
            `${path.join(
              this.configService.getTerraformModulesRootPath(),
              module.name
            )}`
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
                } into ${path.join(
                  this.configService.getTerraformModulesRootPath(),
                  module.name
                )}`
              );
            })
            .catch(err => this.logger.error(err));
        } else {
          const simpleGit = simplegit(
            `${path.join(
              this.configService.getTerraformModulesRootPath(),
              module.name
            )}`
          );
          simpleGit.pull().then((pullResult: simplegit.PullResult) => {
            this.logger.debug(
              `Terraform module ${
                module.name
              } has been updated. ${JSON.stringify(pullResult.summary)}`
            );
          });
        }
      });
  }

  initPackerModules() {
    this.configService
      .getPackerModules()
      .filter(m => m.type === 'git' && m.url)
      .forEach(module => {
        // Check if folder already exist
        if (
          !fs.existsSync(
            `${path.join(
              this.configService.getPackerModulesRootPath(),
              module.name
            )}`
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
                `Packer module ${module.name} has been initialized from ${
                  module.url
                } into ${path.join(
                  this.configService.getPackerModulesRootPath(),
                  module.name
                )}`
              );
            })
            .catch(err => this.logger.error(err));
        } else {
          const simpleGit = simplegit(
            `${path.join(
              this.configService.getPackerModulesRootPath(),
              module.name
            )}`
          );
          simpleGit.pull().then((pullResult: simplegit.PullResult) => {
            this.logger.debug(
              `Packer module ${module.name} has been updated. ${JSON.stringify(
                pullResult.summary
              )}`
            );
          });
        }
      });
  }
}
