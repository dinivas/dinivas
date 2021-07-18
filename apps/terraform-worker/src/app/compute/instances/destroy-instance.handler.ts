/* eslint-disable no-async-promise-executor */
import { TerraformStateService } from '../../terraform-state.service';
import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  TerraformDestroyEvent,
  InstanceDTO,
  DestroyInstanceCommand,
} from '@dinivas/api-interfaces';
import { WSGateway } from '../../wsgateway';
import { Terraform } from '../..//terraform/core';
import { ConfigurationService } from '../../configuration.service';
import { firstValueFrom } from 'rxjs';

@CommandHandler(DestroyInstanceCommand)
export class DestroyInstanceHandler
  implements ICommandHandler<DestroyInstanceCommand>
{
  private readonly logger = new Logger(DestroyInstanceHandler.name);
  terraform: Terraform;
  constructor(
    private readonly configService: ConfigurationService,
    private readonly terraformStateService: TerraformStateService,
    private readonly terraformGateway: WSGateway
  ) {
    this.terraform = new Terraform(this.configService);
  }

  async execute(command: DestroyInstanceCommand) {
    return new Promise<void>(async (resolve, reject) => {
      this.logger.debug(
        `Received DestroyProjectCommand: ${command.instance.code}`
      );
      this.terraform.executeInTerraformModuleDir(
        command.instance.code,
        command.cloudprovider,
        'project_instance',
        command.cloudConfig,
        async (workingDir) => {
          const rawState = await firstValueFrom(
            this.terraformStateService.findState(
              command.instance.project.code.toLowerCase(),
              'project_base'
            )
          );
          this.terraform.addSshViaBastionConfigFileToModule(
            JSON.parse(rawState.state),
            workingDir
          );
        },
        async (workingDir) => {
          try {
            await this.terraform.destroy(
              workingDir,
              [
                '-auto-approve',
                ...this.terraform.computeTerraformInstanceModuleVars(
                  command.instance,
                  command.consul,
                  command.cloudConfig
                ),
              ],
              {
                autoApprove: true,
                silent: false,
              }
            );
            this.terraformGateway.emit(
              `destroyEvent-${command.instance.code}`,
              {
                source: command.instance,
              } as TerraformDestroyEvent<InstanceDTO>
            );
            resolve();
          } catch (error) {
            this.terraformGateway.emit(
              `destroyEvent-${command.instance.code}-error`,
              error.message
            );
            reject(error);
          }
        }
      );
    });
  }
}
