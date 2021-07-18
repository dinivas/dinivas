import {
  ApplyProjectCommand,
  BULL_TERRAFORM_MODULE_QUEUE,
  DestroyProjectCommand,
  PlanProjectCommand,
} from '@dinivas/api-interfaces';
import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { PlanProjectHandler } from '../projects/plan-project.handler';
import { Job } from 'bull';
import { ApplyProjectHandler } from '../projects/apply-project.handler';
import { DestroyProjectHandler } from '../projects/destroy-project.handler';

@Processor(BULL_TERRAFORM_MODULE_QUEUE)
export class TerraformProcessor {
  private readonly logger = new Logger(TerraformProcessor.name);

  constructor(
    private readonly planProjectHandler: PlanProjectHandler,
    private readonly applyProjectHandler: ApplyProjectHandler,
    private readonly destroyProjectHandler: DestroyProjectHandler
  ) {}

  @Process('plan-project')
  async handleTerraformPlan(planJob: Job<PlanProjectCommand>) {
    this.logger.debug(
      `Receive Plan Job [${planJob.id}] with datas: ${JSON.stringify(
        planJob.data as PlanProjectCommand
      )}`
    );
    return this.planProjectHandler.execute(
      planJob,
      PlanProjectCommand.from(planJob.data)
    );
  }

  @Process('apply-project')
  async handleTerraformApply(applyJob: Job<ApplyProjectCommand>) {
    this.logger.debug(
      `Receive Apply Job [${applyJob.id}]  with datas: ${JSON.stringify(
        applyJob
      )}`
    );
    return this.applyProjectHandler.execute(
      applyJob,
      ApplyProjectCommand.from(applyJob.data)
    );
  }

  @Process('destroy-project')
  async handleTerraformDestroy(destroyJob: Job<DestroyProjectCommand>) {
    this.logger.debug(
      `Receive Destroy Job with datas: ${JSON.stringify(destroyJob)}`
    );
    return this.destroyProjectHandler.execute(
      destroyJob,
      DestroyProjectCommand.from(destroyJob.data)
    );
  }
}
