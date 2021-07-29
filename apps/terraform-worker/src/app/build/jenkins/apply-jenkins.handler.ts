/* eslint-disable no-async-promise-executor */
import { WSGateway } from '../../wsgateway';
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
  terraform: Terraform;
  constructor(
    private readonly configService: ConfigurationService,
    private readonly terraformGateway: WSGateway
  ) {
    this.terraform = new Terraform(configService);
  }

  async execute(job: Job<ApplyJenkinsCommand>, command: ApplyJenkinsCommand) {
    return new Promise<any>(async (resolve, reject) => {
      this.logger.debug(
        `Received ApplyJenkinsCommand: ${command.jenkins.code}`
      );
      try {
        job.progress(20);
        const stateResult: TFStateRepresentation = await this.terraform.apply(
          command.workingDir,
          ['-auto-approve', '"last-plan"'],
          {
            autoApprove: true,
            silent: this.configService.getOrElse(
              'terraform.apply.log_silent',
              false
            ),
          }
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
        reject(error);
      }
    });
  }
}
