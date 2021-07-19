import { ConfigurationService } from '../configuration.service';
import { Injectable, Logger } from '@nestjs/common';
import * as simplegit from 'simple-git/promise';
import fs = require('fs');
import path = require('path');

@Injectable()
export class GitService {
  private readonly logger = new Logger(GitService.name);

  constructor(private configService: ConfigurationService) {
    this.initPackerModules();
  }

  initPackerModules() {
    this.configService
      .getPackerModules()
      .filter((m) => m.type === 'git' && m.url)
      .forEach((module) => {
        // Check if folder already exist
        if (
          !fs.existsSync(
            `${path.join(
              this.configService.getPackerModulesRootPath(),
              module.name
            )}`
          )
        ) {
          const simpleGit = simplegit(
            this.configService.getPackerModulesRootPath()
          );
          //clone
          simpleGit
            .clone(module.url, module.name, {})
            .then((err) => {
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
            .catch((err) => this.logger.error(err));
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
