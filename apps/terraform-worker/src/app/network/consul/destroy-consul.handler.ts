/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-async-promise-executor */
import { ConfigurationService } from '../../configuration.service';
import { Injectable, Logger } from '@nestjs/common';
import {
  TerraformDestroyEvent,
  ConsulDTO,
  DestroyConsulCommand,
} from '@dinivas/api-interfaces';
import { Terraform } from '../../terraform/core';
import { Job } from 'bull';

@Injectable()
export class DestroyConsulHandler {
  private readonly logger = new Logger(DestroyConsulHandler.name);
  constructor(
    private readonly configService: ConfigurationService,
    private terraform: Terraform
  ) {}

  async execute(job: Job<DestroyConsulCommand>, command: DestroyConsulCommand) {
    return new Promise<any>(async (resolve, reject) => {
      this.logger.debug(
        `Received DestroyProjectCommand: ${command.consul.code}`
      );

      job.progress(10);
      try {
        await this.terraform.destroy(
          ['-var-file=ssh-via-bastion.tfvars ', '-auto-approve'],
          {
            autoApprove: true,
            silent: !this.configService.getOrElse(
              'terraform.destroy.verbose',
              false
            ),
          },
          `dinivas-project-${command.consul.project.code.toLowerCase()}`,
          `consul/${command.consul.code.toLowerCase()}`
        );
        const result = {
          module: 'consul',
          eventCode: `destroyEvent-${command.consul.code}`,
          event: {
            source: command.consul,
          } as TerraformDestroyEvent<ConsulDTO>,
        };
        job.progress(100);
        resolve(result);
      } catch (error) {
        job.log(error);
        reject(error);
      }
    });
  }
}
