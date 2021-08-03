/* eslint-disable no-async-promise-executor */
import { ConfigurationService } from '../../configuration.service';
import { Terraform } from '../../terraform/core/Terraform';
import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bull';
import {
  TFStateRepresentation,
  TerraformApplyEvent,
  JenkinsDTO,
  ApplyJenkinsCommand,
} from '@dinivas/api-interfaces';

@Injectable()
export class ApplyJenkinsHandler {
  private readonly logger = new Logger(ApplyJenkinsHandler.name);
  constructor(
    private readonly configService: ConfigurationService,
    private terraform: Terraform
  ) {}

  async execute(job: Job<ApplyJenkinsCommand>, command: ApplyJenkinsCommand) {
    return new Promise<any>(async (resolve, reject) => {
      this.logger.debug(
        `Received ApplyJenkinsCommand: ${command.jenkins.code}`
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
          `dinivas-project-${command.jenkins.project.code.toLowerCase()}`,
          `jenkins/${command.jenkins.code.toLowerCase()}`
        );
        const result = {
          module: 'jenkins',
          eventCode: `applyEvent-${command.jenkins.code}`,
          event: {
            source: command.jenkins,
            stateResult,
          } as TerraformApplyEvent<JenkinsDTO>,
        };
        job.progress(100);
        resolve(result);
      } catch (error) {
        console.error(JSON.stringify(error));
        job.returnvalue = {
          module: 'jenkins',
          eventCode: `applyEvent-${command.jenkins.code}-error`,
          error,
        };
        reject(error);
      }
    });
  }
}
