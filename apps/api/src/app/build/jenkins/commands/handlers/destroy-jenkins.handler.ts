/* eslint-disable no-async-promise-executor */
import { TerraformStateService } from './../../../../terraform/terraform-state/terraform-state.service';
import { TerraformGateway } from './../../../../terraform/terraform.gateway';
import { JenkinsService } from './../../jenkins.service';
import { ConfigurationService } from './../../../../core/config/configuration.service';
import { Terraform } from './../../../../terraform/core/Terraform';
import { DestroyJenkinsCommand } from './../impl/destroy-jenkins.command';
import { Logger } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { TerraformDestroyEvent, JenkinsDTO } from '@dinivas/api-interfaces';

@CommandHandler(DestroyJenkinsCommand)
export class DestroyJenkinsHandler
  implements ICommandHandler<DestroyJenkinsCommand> {
  private readonly logger = new Logger(DestroyJenkinsHandler.name);
  terraform: Terraform;
  constructor(
    private readonly publisher: EventPublisher,
    private readonly configService: ConfigurationService,
    private readonly jenkinsService: JenkinsService,
    private readonly terraformStateService: TerraformStateService,
    private readonly terraformGateway: TerraformGateway
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
        async workingDir => {
          const rawState = await this.terraformStateService.findState(
            command.jenkins.project.code.toLowerCase(),
            'project_base'
          );
          this.terraform.addSshViaBastionConfigFileToModule(JSON.parse(rawState.state), workingDir);
          this.terraform.addJenkinsSlaveFilesToModule(
            command.jenkins,
            command.consul,
            command.cloudConfig,
            workingDir
          );
        },
        async workingDir => {
          try {
            await this.terraform.destroy(
              workingDir,
              [
                '-auto-approve',
                ...this.terraform.computeTerraformJenkinsModuleVars(
                  command.jenkins,
                  command.consul,
                  command.cloudConfig
                )
              ],
              {
                autoApprove: true,
                silent: false
              }
            );
            await this.jenkinsService.delete(command.jenkins.id);
            this.terraformGateway.emit(`destroyEvent-${command.jenkins.code}`, {
              source: command.jenkins
            } as TerraformDestroyEvent<JenkinsDTO>);
            resolve();
          } catch (error) {
            this.terraformGateway.emit(
              `destroyEvent-${command.jenkins.code}-error`,
              error.message
            );
          }
        }
      );
    });
  }
}
