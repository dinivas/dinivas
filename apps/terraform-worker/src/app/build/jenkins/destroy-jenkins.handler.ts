/* eslint-disable no-async-promise-executor */
import { ConfigurationService } from '../../configuration.service';
import { Terraform } from './../../terraform/core/Terraform';
import { Injectable, Logger } from '@nestjs/common';
import {
  TerraformDestroyEvent,
  JenkinsDTO,
  DestroyJenkinsCommand,
} from '@dinivas/api-interfaces';
import { Job } from 'bull';

@Injectable()
export class DestroyJenkinsHandler {
  private readonly logger = new Logger(DestroyJenkinsHandler.name);
  constructor(
    private readonly configService: ConfigurationService,
    private terraform: Terraform
  ) {}

  async execute(
    job: Job<DestroyJenkinsCommand>,
    command: DestroyJenkinsCommand
  ) {
    return new Promise<any>(async (resolve, reject) => {
      this.logger.debug(
        `Received DestroyProjectCommand: ${command.jenkins.code}`
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
          `dinivas-project-${command.jenkins.project.code.toLowerCase()}`,
          `jenkins/${command.jenkins.code.toLowerCase()}`
        );
        const result = {
          module: 'jenkins',
          eventCode: `destroyEvent-${command.jenkins.code}`,
          event: {
            source: command.jenkins,
          } as TerraformDestroyEvent<JenkinsDTO>,
        };
        job.progress(100);
        resolve(result);
      } catch (error) {
        job.log(error)
        reject(error);
      }
    });
  }
}
