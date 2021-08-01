import { Terraform } from '../terraform/core/Terraform';
import { ConfigurationService } from '../configuration.service';
import { Injectable, Logger } from '@nestjs/common';
import {
  TerraformPlanEvent,
  TFPlanRepresentation,
  ProjectDTO,
  PlanProjectCommand,
} from '@dinivas/api-interfaces';
import { Job } from 'bull';

@Injectable()
export class PlanProjectHandler {
  private readonly logger = new Logger(PlanProjectHandler.name);
  terraform: Terraform;
  constructor(private readonly configService: ConfigurationService) {
    this.terraform = new Terraform(this.configService);
  }

  async execute(job: Job<PlanProjectCommand>, command: PlanProjectCommand) {
    this.logger.debug(
      `Received PlanProjectCommand: ${command.projectName} (${command.projectCode})`
    );
    job.log(
      `Received PlanProjectCommand: ${command.projectName} (${command.projectCode})`
    );
    job.progress(5);
    return new Promise<any>((resolve, reject) => {
      this.terraform.executeInTerraformModuleDir(
        command.projectCode,
        command.cloudprovider,
        'project_base',
        command.cloudConfig,
        null,
        async (workingDir) => {
          try {
            job.progress(60);
            this.terraform.addKeycloakProviderConfigFileToModule(
              command.project,
              workingDir
            );
            const planResult: TFPlanRepresentation = await this.terraform.plan(
              workingDir,
              [
                ...this.terraform.computeTerraformProjectBaseModuleVars(
                  command.project,
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
              module: 'project',
              eventCode: `planEvent-${command.projectCode}`,
              event: {
                source: command.project,
                workingDir,
                planResult,
              } as TerraformPlanEvent<ProjectDTO>,
            };
            job.progress(100);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        },
        (err) => reject(err)
      );
    });
  }
}
