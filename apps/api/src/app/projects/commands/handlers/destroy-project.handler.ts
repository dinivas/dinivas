/* eslint-disable no-async-promise-executor */
import { ConsulService } from './../../../network/consul/consul.service';
import { ProjectsService } from './../../projects.service';
import { DestroyProjectCommand } from './../impl/destroy-project.command';
import { TerraformGateway } from '../../../terraform/terraform.gateway';
import { Terraform } from '../../../terraform/core/Terraform';
import { ConfigurationService } from '../../../core/config/configuration.service';
import { Logger } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { TerraformDestroyEvent, ProjectDTO } from '@dinivas/api-interfaces';

@CommandHandler(DestroyProjectCommand)
export class DestroyProjectHandler
  implements ICommandHandler<DestroyProjectCommand> {
  private readonly logger = new Logger(DestroyProjectHandler.name);
  terraform: Terraform;
  constructor(
    private readonly publisher: EventPublisher,
    private readonly configService: ConfigurationService,
    private readonly projectsService: ProjectsService,
    private readonly consulService: ConsulService,
    private readonly terraformGateway: TerraformGateway
  ) {
    this.terraform = new Terraform(this.configService);
  }

  async execute(command: DestroyProjectCommand) {
    return new Promise<void>(async (resolve, reject) => {
      this.logger.debug(
        `Received DestroyProjectCommand: ${command.project.name} (${
          command.project.name
        })`
      );
      this.terraform.executeInTerraformModuleDir(
        command.project.code,
        command.cloudprovider,
        'project_base',
        command.cloudConfig,
        null,
        async workingDir => {
          try {
            this.terraform.addKeycloakProviderConfigFileToModule(command.project, workingDir);
            await this.terraform.destroy(
              workingDir,
              [
                '-auto-approve',
                ...this.terraform.computeTerraformProjectBaseModuleVars(
                  command.project,
                  command.consul,
                  command.cloudConfig
                )
              ],
              {
                autoApprove: true,
                silent: false
              }
            );
            await this.consulService.delete(command.consul.id);
            await this.projectsService.delete(command.project.id);

            this.terraformGateway.emit(`destroyEvent-${command.project.code}`, {
              source: command.project
            } as TerraformDestroyEvent<ProjectDTO>);
            resolve();
          } catch (error) {
            this.terraformGateway.emit(
              `destroyEvent-${command.project.code}-error`,
              error.message
            );
          }
        }
      );
    });
  }
}
