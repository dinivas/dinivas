/* eslint-disable no-async-promise-executor */
import { TerraformStateService } from '../../../../terraform/terraform-state/terraform-state.service';
import { TerraformGateway } from '../../../../terraform/terraform.gateway';
import { InstancesService } from './../../instances.service';
import { ConfigurationService } from '../../../../core/config/configuration.service';
import { Terraform } from '../../../../terraform/core/Terraform';
import { DestroyInstanceCommand } from '../impl/destroy-instance.command';
import { Logger } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { TerraformDestroyEvent, InstanceDTO } from '@dinivas/api-interfaces';

@CommandHandler(DestroyInstanceCommand)
export class DestroyInstanceHandler
  implements ICommandHandler<DestroyInstanceCommand> {
  private readonly logger = new Logger(DestroyInstanceHandler.name);
  terraform: Terraform;
  constructor(
    private readonly publisher: EventPublisher,
    private readonly configService: ConfigurationService,
    private readonly instancesService: InstancesService,
    private readonly terraformStateService: TerraformStateService,
    private readonly terraformGateway: TerraformGateway
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
        async workingDir => {
          const rawState = await this.terraformStateService.findState(
            command.instance.project.code.toLowerCase(),
            'project_base'
          );
          this.terraform.addSshViaBastionConfigFileToModule(JSON.parse(rawState.state), workingDir);
        },
        async workingDir => {
          try {
            await this.terraform.destroy(
              workingDir,
              [
                '-auto-approve',
                ...this.terraform.computeTerraformInstanceModuleVars(
                  command.instance,
                  command.consul,
                  command.cloudConfig
                )
              ],
              {
                autoApprove: true,
                silent: false
              }
            );
            await this.instancesService.delete(command.instance.id);
            this.terraformGateway.emit(`destroyEvent-${command.instance.code}`, {
              source: command.instance
            } as TerraformDestroyEvent<InstanceDTO>);
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
