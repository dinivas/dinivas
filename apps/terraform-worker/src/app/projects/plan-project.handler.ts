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
  constructor(
    private readonly configService: ConfigurationService,
    private terraform: Terraform
  ) {}

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
        async (workingDir) => {
          this.terraform.addTerraformProjectBaseModuleFile(
            command.project,
            command.consul,
            command.cloudConfig,
            workingDir
          );
        },
        async (workingDir) => {
          try {
            job.progress(60);
            this.terraform.addKeycloakProviderConfigFileToModule(
              command.project,
              workingDir
            );

            const planResult: TFPlanRepresentation = await this.terraform.plan(
              workingDir,
              ['-out=tfplan'],
              {
                silent: !this.configService.getOrElse(
                  'terraform.plan.verbose',
                  false
                ),
              },
              `dinivas-project-${command.projectCode.toLowerCase()}`,
              `project_base`
            );
            const result = {
              module: 'project',
              eventCode: `planEvent-${command.projectCode}`,
              event: {
                source: command.project,
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
