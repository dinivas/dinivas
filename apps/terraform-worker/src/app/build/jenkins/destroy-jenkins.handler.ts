/* eslint-disable no-async-promise-executor */
import { ConfigurationService } from '../../configuration.service';
import { Terraform } from './../../terraform/core/Terraform';
import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  TerraformDestroyEvent,
  JenkinsDTO,
  DestroyJenkinsCommand,
} from '@dinivas/api-interfaces';
import { TerraformStateService } from '../../terraform-state.service';
import { WSGateway } from '../../wsgateway';
import { firstValueFrom } from 'rxjs';

@CommandHandler(DestroyJenkinsCommand)
export class DestroyJenkinsHandler
  implements ICommandHandler<DestroyJenkinsCommand>
{
  private readonly logger = new Logger(DestroyJenkinsHandler.name);
  terraform: Terraform;
  constructor(
    private readonly configService: ConfigurationService,
    private readonly terraformStateService: TerraformStateService,
    private readonly terraformGateway: WSGateway
  ) {
    this.terraform = new Terraform(this.configService);
  }

  async execute(command: DestroyJenkinsCommand) {
    return new Promise<void>(async (resolve, reject) => {
      this.logger.debug(
        `Received DestroyProjectCommand: ${command.jenkins.code}`
      );
      this.terraform.executeInTerraformModuleDir(
        command.jenkins.code,
        command.cloudprovider,
        'jenkins',
        command.cloudConfig,
        async (workingDir) => {
          const rawState = await firstValueFrom(
            this.terraformStateService.findState(
              command.jenkins.project.code.toLowerCase(),
              'project_base'
            )
          );
          this.terraform.addSshViaBastionConfigFileToModule(
            JSON.parse(rawState.state),
            workingDir
          );
          this.terraform.addJenkinsSlaveFilesToModule(
            command.jenkins,
            command.consul,
            command.cloudConfig,
            workingDir
          );
        },
        async (workingDir) => {
          try {
            await this.terraform.destroy(
              workingDir,
              [
                '-auto-approve',
                ...this.terraform.computeTerraformJenkinsModuleVars(
                  command.jenkins,
                  command.consul,
                  command.cloudConfig
                ),
              ],
              {
                autoApprove: true,
                silent: false,
              }
            );
            this.terraformGateway.emit(`destroyEvent-${command.jenkins.code}`, {
              source: command.jenkins,
            } as TerraformDestroyEvent<JenkinsDTO>);
            resolve();
          } catch (error) {
            this.terraformGateway.emit(
              `destroyEvent-${command.jenkins.code}-error`,
              error.message
            );
            reject(error);
          }
        }
      );
    });
  }
}
