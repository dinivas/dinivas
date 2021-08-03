/* eslint-disable no-async-promise-executor */
import { ConfigurationService } from '../../configuration.service';
import { Injectable, Logger } from '@nestjs/common';
import {
  TFStateRepresentation,
  TerraformApplyEvent,
  ConsulDTO,
  ApplyConsulCommand,
} from '@dinivas/api-interfaces';
import { Terraform } from '../../terraform/core';
import { Job } from 'bull';

@Injectable()
export class ApplyConsulHandler {
  private readonly logger = new Logger(ApplyConsulCommand.name);
  constructor(
    private readonly configService: ConfigurationService,
    private terraform: Terraform
  ) {}

  async execute(job: Job<ApplyConsulCommand>, command: ApplyConsulCommand) {
    return new Promise<any>(async (resolve, reject) => {
      this.logger.debug(`Received ApplyConsulCommand: ${command.consul.code}`);
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
          `dinivas-project-${command.consul.project.code.toLowerCase()}`,
          `consul/${command.consul.code.toLowerCase()}`
        );
        const result = {
          module: 'consul',
          eventCode: `applyEvent-${command.consul.code}`,
          event: {
            source: command.consul,
            stateResult,
          } as TerraformApplyEvent<ConsulDTO>,
        };
        job.progress(100);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }
}
