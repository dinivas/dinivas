import { ConfigurationService } from '../../configuration.service';
import { Terraform } from '../../terraform/core/Terraform';
import { Injectable, Logger } from '@nestjs/common';
import {
  TFStateRepresentation,
  TerraformApplyEvent,
  InstanceDTO,
  ApplyInstanceCommand,
} from '@dinivas/api-interfaces';
import { Job } from 'bull';

@Injectable()
export class ApplyInstanceHandler {
  private readonly logger = new Logger(ApplyInstanceCommand.name);
  constructor(
    private readonly configService: ConfigurationService,
    private terraform: Terraform
  ) {}

  async execute(job: Job<ApplyInstanceCommand>, command: ApplyInstanceCommand) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise<any>(async (resolve, reject) => {
      this.logger.debug(
        `Received ApplyInstanceCommand: ${command.instance.code}`
      );
      try {
        job.progress(20);
        const stateResult: TFStateRepresentation = await this.terraform.apply(
          ['-auto-approve', '"tfplan"'],
          {
            autoApprove: true,
            silent: !this.configService.getOrElse(
              'terraform.apply.verbose',
              false
            ),
          },
          `dinivas-project-${command.instance.project.code.toLowerCase()}`,
          `project_instance/${command.instance.code.toLowerCase()}`
        );
        const result = {
          module: 'instance',
          eventCode: `applyEvent-${command.instance.code}`,
          event: {
            source: command.instance,
            stateResult,
          } as TerraformApplyEvent<InstanceDTO>,
        };
        job.progress(100);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }
}
