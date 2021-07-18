import { ConfigurationService } from '../../configuration.service';
import { Terraform } from '../../terraform/core/Terraform';
import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  TFStateRepresentation,
  TerraformApplyEvent,
  InstanceDTO,
  ApplyInstanceCommand,
} from '@dinivas/api-interfaces';
import { WSGateway } from '../../wsgateway';

@CommandHandler(ApplyInstanceCommand)
export class ApplyInstanceHandler
  implements ICommandHandler<ApplyInstanceCommand>
{
  private readonly logger = new Logger(ApplyInstanceCommand.name);
  terraform: Terraform;
  constructor(
    private readonly configService: ConfigurationService,
    private readonly terraformGateway: WSGateway
  ) {
    this.terraform = new Terraform(configService);
  }

  async execute(command: ApplyInstanceCommand) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise<void>(async (resolve, reject) => {
      this.logger.debug(
        `Received ApplyInstanceCommand: ${command.instance.code}`
      );
      try {
        const stateResult: TFStateRepresentation = await this.terraform.apply(
          command.workingDir,
          ['-auto-approve', '"last-plan"'],
          { autoApprove: true, silent: false }
        );
        resolve();
        this.terraformGateway.emit(`applyEvent-${command.instance.code}`, {
          source: command.instance,
          stateResult,
        } as TerraformApplyEvent<InstanceDTO>);
      } catch (error) {
        reject(error);
        this.terraformGateway.emit(
          `applyEvent-${command.instance.code}-error`,
          error.message
        );
      }
    });
  }
}
