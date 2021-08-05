/* eslint-disable no-async-promise-executor */
import { Terraform } from '../terraform/core/Terraform';
import { ConfigurationService } from '../configuration.service';
import { Injectable, Logger } from '@nestjs/common';
import { TerraformCommand } from '@dinivas/api-interfaces';
import { Job } from 'bull';

@Injectable()
export class DestroyCommandHandler {
  private readonly logger = new Logger(DestroyCommandHandler.name);
  constructor(
    private readonly configService: ConfigurationService,
    private terraform: Terraform
  ) {}

  async execute(
    job: Job<TerraformCommand<any>>,
    command: TerraformCommand<any>
  ) {
    return new Promise<any>(async (resolve, reject) => {
      const receivedLogText = `Received DestroyCommand: CloudProvider: ${command.cloudprovider}, Module: ${command.moduleId} Service Code: ${command.commandServiceCode}`;
      this.logger.debug(receivedLogText);
      job.log(receivedLogText);
      job.progress(10);
      try {
        await this.terraform.destroy(
          job,
          [
            'project_base' !== command.moduleId
              ? '-var-file=ssh-via-bastion.tfvars'
              : '',
            '-auto-approve',
          ],
          {
            autoApprove: true,
            silent: !this.configService.getOrElse(
              'terraform.destroy.verbose',
              false
            ),
          },
          `dinivas-project-${command.projectCode.toLowerCase()}`,
          `${command.moduleId}/${command.commandServiceCode}`
        );
        const result = {
          module: command.moduleId,
          eventCode: `destroyEvent-${command.commandServiceCode}`,
          event: {
            source: {
              data: command.data,
              project: command.project,
              consul: command.projectConsul,
            },
          },
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
