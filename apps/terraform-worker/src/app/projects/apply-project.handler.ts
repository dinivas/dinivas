/* eslint-disable no-async-promise-executor */
import { Terraform } from './../terraform/core/Terraform';
import { ConfigurationService } from '../configuration.service';
import { Injectable, Logger } from '@nestjs/common';
import {
  TFStateRepresentation,
  TerraformApplyEvent,
  ProjectDTO,
  ApplyProjectCommand,
} from '@dinivas/api-interfaces';
import { Job } from 'bull';

@Injectable()
export class ApplyProjectHandler {
  private readonly logger = new Logger(ApplyProjectCommand.name);
  constructor(
    private readonly configService: ConfigurationService,
    private terraform: Terraform
  ) {}

  async execute(job: Job<ApplyProjectCommand>, command: ApplyProjectCommand) {
    return new Promise<any>(async (resolve, reject) => {
      this.logger.debug(
        `Received ApplyProjectCommand: ${command.project.name} (${command.project.name})`
      );
      try {
        job.progress(20);
        const stateResult: TFStateRepresentation = await this.terraform.apply(
          ['-auto-approve', '"tfplan"'],
          {
            autoApprove: true,
            silent: !this.configService.getOrElse(
              'terraform.apply.verbose',
              false
            ),
          },
          `dinivas-project-${command.project.code.toLowerCase()}`,
          `project_base`
        );
        const result = {
          module: 'project',
          eventCode: `applyEvent-${command.project.code}`,
          event: {
            source: command.project,
            stateResult,
          } as TerraformApplyEvent<ProjectDTO>,
        };
        job.progress(100);
        resolve(result);
      } catch (error) {
        this.logger.error(error);
        reject(error);
      }
    });
  }
}
