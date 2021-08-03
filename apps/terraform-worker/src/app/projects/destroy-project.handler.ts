/* eslint-disable no-async-promise-executor */
import { Terraform } from '../terraform/core/Terraform';
import { ConfigurationService } from '../configuration.service';
import { Injectable, Logger } from '@nestjs/common';
import {
  ProjectDTO,
  DestroyProjectCommand,
  TerraformDestroyEvent,
  ConsulDTO,
} from '@dinivas/api-interfaces';
import { Job } from 'bull';

@Injectable()
export class DestroyProjectHandler {
  private readonly logger = new Logger(DestroyProjectHandler.name);
  constructor(
    private readonly configService: ConfigurationService,
    private terraform: Terraform
  ) {}

  async execute(
    job: Job<DestroyProjectCommand>,
    command: DestroyProjectCommand
  ) {
    return new Promise<any>(async (resolve, reject) => {
      this.logger.debug(
        `Received DestroyProjectCommand: ${command.project.name} (${command.project.name})`
      );
      try {
        job.progress(20);
        await this.terraform.destroy(
          ['-auto-approve'],
          {
            autoApprove: true,
            silent: !this.configService.getOrElse(
              'terraform.destroy.verbose',
              false
            ),
          },
          `dinivas-project-${command.project.code.toLowerCase()}`,
          `project_base`
        );
        job.progress(100);
        const result = {
          module: 'project',
          eventCode: `destroyEvent-${command.project.code}`,
          event: {
            source: { project: command.project, consul: command.consul },
          } as TerraformDestroyEvent<{
            project: ProjectDTO;
            consul: ConsulDTO;
          }>,
        };
        resolve(result);
      } catch (error) {
        this.logger.error(error);
        reject(error);
      }
    });
  }
}
