import { ApplyProjectCommand } from './../impl/apply-project.command';
import { TerraformGateway } from './../../../terraform/terraform.gateway';
import { Terraform } from './../../../terraform/core/Terraform';
import { ConfigService } from './../../../core/config/config.service';
import { Logger } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { TerraformPlanEvent } from '@dinivas/dto';
import { ResourceCounts } from '../../../terraform/core/Types';

@CommandHandler(ApplyProjectCommand)
export class ApplyProjectHandler
  implements ICommandHandler<ApplyProjectCommand> {
  private readonly logger = new Logger(ApplyProjectCommand.name);
  terraform: Terraform;
  constructor(
    private readonly publisher: EventPublisher,
    private readonly configService: ConfigService,
    private readonly terraformGateway: TerraformGateway
  ) {
    this.terraform = new Terraform(configService);
  }

  async execute(command: ApplyProjectCommand) {
    this.logger.debug(
      `Received ApplyProjectCommand: ${command.project.name} (${
        command.project.name
      })`
    );

    const applyResult: ResourceCounts = await this.terraform.apply(
      command.workingDir,
      ['-auto-approve','"last-plan"'],
      { autoApprove: true, silent: false }
    );
    this.terraformGateway.emit(`applyEvent-${command.project.code}`, {
      project: command.project
    } as TerraformPlanEvent);
  }
}
