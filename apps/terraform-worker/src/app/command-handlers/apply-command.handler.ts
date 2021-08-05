/* eslint-disable no-async-promise-executor */
import { Terraform } from './../terraform/core/Terraform';
import { ConfigurationService } from '../configuration.service';
import { Injectable, Logger } from '@nestjs/common';
import {
  TFStateRepresentation,
  TerraformModuleEvent,
  TerraformCommand,
} from '@dinivas/api-interfaces';
import { Job } from 'bull';

@Injectable()
export class ApplyCommandHandler {
  private readonly logger = new Logger(ApplyCommandHandler.name);
  constructor(
    private readonly configService: ConfigurationService,
    private terraform: Terraform
  ) {}

  async execute(
    job: Job<TerraformCommand<any>>,
    command: TerraformCommand<any>
  ) {
    const receivedLogText = `Received ApplyCommand: CloudProvider: ${command.cloudprovider}, Module: ${command.moduleId} Service Code: ${command.commandServiceCode}`;
    this.logger.debug(receivedLogText);
    job.log(receivedLogText);
    job.progress(5);
    return new Promise<any>(async (resolve, reject) => {
      try {
        const stateResult: TFStateRepresentation = await this.terraform.apply(
          job,
          ['-auto-approve', '"tfplan"'],
          {
            autoApprove: true,
            silent: !this.configService.getOrElse(
              'terraform.apply.verbose',
              false
            ),
          },
          `dinivas-project-${command.projectCode.toLowerCase()}`,
          `${command.moduleId}/${command.commandServiceCode}`
        );
        const result = {
          module: command.moduleId,
          eventCode: `applyEvent-${command.commandServiceCode}`,
          event: {
            source: {
              data: command.data,
              project: command.project,
              consul: command.projectConsul,
            },
            stateResult,
          } as TerraformModuleEvent<any>,
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
