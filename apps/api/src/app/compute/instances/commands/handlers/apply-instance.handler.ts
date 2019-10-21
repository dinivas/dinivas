import { ApplyInstanceCommand } from './../impl/apply-instance.command';
import { TerraformGateway } from '../../../../terraform/terraform.gateway';
import { ConfigService } from '../../../../core/config/config.service';
import { Terraform } from '../../../../terraform/core/Terraform';
import { Logger } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import {
  TFStateRepresentation,
  TerraformApplyEvent,
  InstanceDTO
} from '@dinivas/dto';

@CommandHandler(ApplyInstanceCommand)
export class ApplyInstanceHandler
  implements ICommandHandler<ApplyInstanceCommand> {
  private readonly logger = new Logger(ApplyInstanceCommand.name);
  terraform: Terraform;
  constructor(
    private readonly publisher: EventPublisher,
    private readonly configService: ConfigService,
    private readonly terraformGateway: TerraformGateway
  ) {
    this.terraform = new Terraform(configService);
  }

  async execute(command: ApplyInstanceCommand) {
    return new Promise(async (resolve, reject) => {
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
          stateResult
        } as TerraformApplyEvent<InstanceDTO>);
      } catch (error) {
        this.terraformGateway.emit(
          `applyEvent-${command.instance.code}-error`,
          error.message
        );
      }
    });
  }
}
