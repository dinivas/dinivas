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
  terraform: Terraform;
  constructor(private readonly configService: ConfigurationService) {
    this.terraform = new Terraform(this.configService);
  }

  async execute(
    job: Job<DestroyProjectCommand>,
    command: DestroyProjectCommand
  ) {
    return new Promise<any>(async (resolve, reject) => {
      this.logger.debug(
        `Received DestroyProjectCommand: ${command.project.name} (${command.project.name})`
      );
      this.terraform.executeInTerraformModuleDir(
        command.project.code,
        command.cloudprovider,
        'project_base',
        command.cloudConfig,
        null,
        async (workingDir) => {
          try {
            this.terraform.addKeycloakProviderConfigFileToModule(
              command.project,
              workingDir
            );
            job.progress(20);
            await this.terraform.destroy(
              workingDir,
              [
                '-auto-approve',
                ...this.terraform.computeTerraformProjectBaseModuleVars(
                  command.project,
                  command.consul,
                  command.cloudConfig
                ),
              ],
              {
                autoApprove: true,
                silent: !this.configService.getOrElse(
                  'terraform.destroy.verbose',
                  false
                ),
              }
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
        }
      );
    });
  }
}
