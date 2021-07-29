/* eslint-disable no-async-promise-executor */
import { ConfigurationService } from '../../configuration.service';
import { Terraform } from './../../terraform/core/Terraform';
import { Injectable, Logger } from '@nestjs/common';
import {
  TerraformDestroyEvent,
  JenkinsDTO,
  DestroyJenkinsCommand,
} from '@dinivas/api-interfaces';
import { TerraformStateService } from '../../terraform-state.service';
import { firstValueFrom } from 'rxjs';
import { Job } from 'bull';

@Injectable()
export class DestroyJenkinsHandler {
  private readonly logger = new Logger(DestroyJenkinsHandler.name);
  terraform: Terraform;
  constructor(
    private readonly configService: ConfigurationService,
    private readonly terraformStateService: TerraformStateService
  ) {
    this.terraform = new Terraform(this.configService);
  }

  async execute(
    job: Job<DestroyJenkinsCommand>,
    command: DestroyJenkinsCommand
  ) {
    return new Promise<any>(async (resolve, reject) => {
      this.logger.debug(
        `Received DestroyProjectCommand: ${command.jenkins.code}`
      );
      this.terraform.executeInTerraformModuleDir(
        command.jenkins.code,
        command.cloudprovider,
        'jenkins',
        command.cloudConfig,
        async (workingDir) => {
          const rawState = await firstValueFrom(
            this.terraformStateService.findState(
              command.jenkins.project.code.toLowerCase(),
              'project_base'
            )
          );
          this.terraform.addSshViaBastionConfigFileToModule(
            rawState.state,
            workingDir
          );
          this.terraform.addJenkinsSlaveFilesToModule(
            command.jenkins,
            command.consul,
            command.cloudConfig,
            workingDir
          );
        },
        async (workingDir) => {
          try {
            await this.terraform.destroy(
              workingDir,
              [
                '-auto-approve',
                ...this.terraform.computeTerraformJenkinsModuleVars(
                  command.jenkins,
                  command.consul,
                  command.cloudConfig
                ),
              ],
              {
                autoApprove: true,
                silent: this.configService.getOrElse(
                  'terraform.destroy.log_silent',
                  false
                ),
              }
            );
            const result = {
              module: 'jenkins',
              eventCode: `destroyEvent-${command.jenkins.code}`,
              event: {
                source: command.jenkins,
              } as TerraformDestroyEvent<JenkinsDTO>,
            };
            job.progress(100);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  }
}
