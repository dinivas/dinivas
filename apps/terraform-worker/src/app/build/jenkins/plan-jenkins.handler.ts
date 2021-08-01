import { ConfigurationService } from '../../configuration.service';
import { Terraform } from '../../terraform/core/Terraform';
import { Injectable, Logger } from '@nestjs/common';

import {
  TerraformPlanEvent,
  TFPlanRepresentation,
  JenkinsDTO,
  PlanJenkinsCommand,
} from '@dinivas/api-interfaces';
import { TerraformStateService } from '../../terraform-state.service';
import { firstValueFrom } from 'rxjs';
import { Job } from 'bull';

@Injectable()
export class PlanJenkinsHandler {
  private readonly logger = new Logger(PlanJenkinsHandler.name);
  terraform: Terraform;
  constructor(
    private readonly configService: ConfigurationService,
    private readonly terraformStateService: TerraformStateService
  ) {
    this.terraform = new Terraform(configService);
  }

  async execute(job: Job<PlanJenkinsCommand>, command: PlanJenkinsCommand) {
    this.logger.debug(`Received PlanJenkinsCommand: ${command.jenkins.code}`);
    job.log(`Received PlanJenkinsCommand: ${command.jenkins.code}`);
    job.progress(5);
    return new Promise<any>((resolve, reject) => {
      this.terraform.executeInTerraformModuleDir(
        command.jenkins.code,
        command.cloudprovider,
        'jenkins',
        command.cloudConfig,
        async (workingDir) => {
          try {
            const rawProjectState = await firstValueFrom(
              this.terraformStateService.findState(
                command.jenkins.project.code.toLowerCase(),
                'project_base'
              )
            );
            this.terraform.addSshViaBastionConfigFileToModule(
              rawProjectState,
              workingDir
            );
            this.terraform.addJenkinsSlaveFilesToModule(
              command.jenkins,
              command.consul,
              command.cloudConfig,
              workingDir
            );
          } catch (error) {
            reject(error);
          }
        },
        async (workingDir) => {
          try {
            const planResult: TFPlanRepresentation = await this.terraform.plan(
              workingDir,
              [
                ...this.terraform.computeTerraformJenkinsModuleVars(
                  command.jenkins,
                  command.consul,
                  command.cloudConfig
                ),
                '-out=last-plan',
              ],
              {
                silent: !this.configService.getOrElse(
                  'terraform.plan.verbose',
                  false
                ),
              }
            );
            const result = {
              module: 'jenkins',
              eventCode: `planEvent-${command.jenkins.code}`,
              event: {
                source: command.jenkins,
                workingDir,
                planResult,
              } as TerraformPlanEvent<JenkinsDTO>,
            };
            job.progress(100);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
}
