import { TerraformGateway } from './../../../../terraform/terraform.gateway';
import { JenkinsService } from './../../jenkins.service';
import { ConfigService } from './../../../../core/config/config.service';
import { Terraform } from './../../../../terraform/core/Terraform';
import { DestroyJenkinsCommand } from './../impl/destroy-jenkins.command';
import { Logger } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { TerraformDestroyEvent, JenkinsDTO } from '@dinivas/dto';

@CommandHandler(DestroyJenkinsCommand)
export class DestroyJenkinsHandler
  implements ICommandHandler<DestroyJenkinsCommand> {
  private readonly logger = new Logger(DestroyJenkinsHandler.name);
  terraform: Terraform;
  constructor(
    private readonly publisher: EventPublisher,
    private readonly configService: ConfigService,
    private readonly jenkinsService: JenkinsService,
    private readonly terraformGateway: TerraformGateway
  ) {
    this.terraform = new Terraform(this.configService);
  }

  async execute(command: DestroyJenkinsCommand) {
    return new Promise(async (resolve, reject) => {
      this.logger.debug(
        `Received DestroyProjectCommand: ${command.jenkins.code}`
      );
      this.terraform.executeInTerraformModuleDir(
        command.jenkins.code,
        'jenkins',
        command.cloudConfig,
        async workingDir => {
          await this.terraform.destroy(
            workingDir,
            [
              '-auto-approve',
              ...this.terraform.computeTerraformJenkinsModuleVars(
                command.jenkins
              )
            ],
            {
              autoApprove: true,
              silent: false
            }
          );
          await this.jenkinsService.delete(command.jenkins.id);
          this.terraformGateway.emit(
            `destroyEvent-${command.jenkins.code}`,
            {
              source: command.jenkins
            } as TerraformDestroyEvent<JenkinsDTO>
          );
          resolve();
        }
      );
    });
  }
}
