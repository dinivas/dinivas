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
  constructor(
    private readonly configService: ConfigurationService,
    private readonly terraformStateService: TerraformStateService,
    private terraform: Terraform
  ) {}

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
            this.terraform.addTerraformJenkinsModuleFile(
              command.jenkins,
              command.consul,
              command.cloudConfig,
              workingDir
            );

            this.terraform.addSshViaBastionConfigFileToModule(
              command.jenkins.project.cloud_provider.cloud,
              rawProjectState,
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
              ['-var-file=ssh-via-bastion.tfvars ', '-out=tfplan'],
              {
                silent: !this.configService.getOrElse(
                  'terraform.plan.verbose',
                  false
                ),
              },
              `dinivas-project-${command.jenkins.project.code.toLowerCase()}`,
              `jenkins/${command.jenkins.code.toLowerCase()}`
            );
            const result = {
              module: 'jenkins',
              eventCode: `planEvent-${command.jenkins.code}`,
              event: {
                source: command.jenkins,
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
