/* eslint-disable no-async-promise-executor */
import { Injectable, Logger } from '@nestjs/common';
import {
  TerraformDestroyEvent,
  InstanceDTO,
  DestroyInstanceCommand,
} from '@dinivas/api-interfaces';
import { Terraform } from '../..//terraform/core';
import { ConfigurationService } from '../../configuration.service';
import { Job } from 'bull';

@Injectable()
export class DestroyInstanceHandler {
  private readonly logger = new Logger(DestroyInstanceHandler.name);
  constructor(
    private readonly configService: ConfigurationService,
    private terraform: Terraform
  ) {}

  async execute(
    job: Job<DestroyInstanceCommand>,
    command: DestroyInstanceCommand
  ) {
    return new Promise<any>(async (resolve, reject) => {
      this.logger.debug(
        `Received DestroyProjectCommand: ${command.instance.code}`
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
          `dinivas-project-${command.instance.project.code.toLowerCase()}`,
          `project_instance/${command.instance.code.toLowerCase()}`
        );
        const result = {
          module: 'instance',
          eventCode: `destroyEvent-${command.instance.code}`,
          event: {
            source: command.instance,
          } as TerraformDestroyEvent<InstanceDTO>,
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
