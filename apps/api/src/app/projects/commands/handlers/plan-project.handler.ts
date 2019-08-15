import { TerraformGateway } from './../../../terraform/terraform.gateway';
import { Terraform } from './../../../terraform/core/Terraform';
import { ConfigService } from './../../../core/config/config.service';
import { Logger } from '@nestjs/common';
import { PlanProjectCommand } from './../impl/plan-project.command';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { TerraformPlanEvent, TFPlanRepresentation } from '@dinivas/dto';
const fs = require('fs');
const ncp = require('ncp').ncp;
const path = require('path');
const os = require('os');

@CommandHandler(PlanProjectCommand)
export class PlanProjectHandler implements ICommandHandler<PlanProjectCommand> {
  private readonly logger = new Logger(PlanProjectHandler.name);
  terraform: Terraform;
  constructor(
    private readonly publisher: EventPublisher,
    private readonly configService: ConfigService,
    private readonly terraformGateway: TerraformGateway
  ) {
    this.terraform = new Terraform(configService);
  }

  async execute(command: PlanProjectCommand) {
    this.logger.debug(
      `Received PlanProjectCommand: ${command.projectName} (${
        command.projectCode
      })`
    );
    fs.mkdtemp(
      path.join(os.tmpdir(), `project-${command.projectCode}-`),
      (err: any, tempFolder: string) => {
        if (err) throw err;
        // Copy module to /tmp
        ncp(
          path.join(
            this.configService.getTerraformModulesRootPath(),
            'project_base'
          ),
          path.join(tempFolder),
          async (error: any) => {
            if (error) {
              return console.error(error);
            }
            this.logger.debug(`Working Terraform folder: ${tempFolder}`);
            this.terraform.addBackendConfigFileToModule(
              command.projectCode,
              'project_base',
              tempFolder
            );

            this.terraform.addProviderConfigFileToModule(
              command.cloudConfig,
              tempFolder
            );

            await this.terraform.init(tempFolder, [], { silent: false });

            const planResult: TFPlanRepresentation = await this.terraform.plan(
              tempFolder,
              [
                `-var 'project_name=${command.projectName}'`,
                `-var 'bastion_ssh_user=centos'`,
                `-var 'bastion_image_name=Centos 7'`,
                `-var 'bastion_compute_flavor_name=m1.small'`,
                `-var 'public_router_name=${command.public_router}'`,
                `-var 'prometheus_image_name=ShepherdCloud Prometheus'`,
                '-out=last-plan'
              ],
              { silent: false }
            );
            this.terraformGateway.emit(`planEvent-${command.projectCode}`, {
              project: command.project,
              workingDir: tempFolder,
              planResult: planResult
            } as TerraformPlanEvent);
          }
        );
      }
    );
  }
}
