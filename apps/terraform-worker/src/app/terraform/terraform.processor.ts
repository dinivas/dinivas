import {
  PlanCommandHandler,
  ApplyCommandHandler,
  DestroyCommandHandler,
} from './../command-handlers';
import {
  BULL_TERRAFORM_MODULE_QUEUE,
  TerraformCommand,
} from '@dinivas/api-interfaces';
import { Job } from 'bull';
import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';

@Processor(BULL_TERRAFORM_MODULE_QUEUE)
export class TerraformProcessor {
  private readonly logger = new Logger(TerraformProcessor.name);

  constructor(
    private readonly planCommandHandler: PlanCommandHandler,
    private readonly applyCommandHandler: ApplyCommandHandler,
    private readonly destroyCommandHandler: DestroyCommandHandler
  ) {}

  @Process('plan')
  async handleTerraformPlanProject(planJob: Job<TerraformCommand<any>>) {
    this.logger.debug(
      `Receive Plan Job [${planJob.id}] with datas: ${JSON.stringify(
        planJob.data
      )}`
    );
    return this.planCommandHandler.execute(planJob, planJob.data);
  }

  @Process('apply')
  async handleTerraformApplyProject(applyJob: Job<TerraformCommand<any>>) {
    this.logger.debug(
      `Receive Apply Job [${applyJob.id}]  with datas: ${JSON.stringify(
        applyJob
      )}`
    );
    return this.applyCommandHandler.execute(applyJob, applyJob.data);
  }

  @Process('destroy')
  async handleTerraformDestroyProject(destroyJob: Job<TerraformCommand<any>>) {
    this.logger.debug(
      `Receive Destroy Job with datas: ${JSON.stringify(destroyJob)}`
    );
    return this.destroyCommandHandler.execute(destroyJob, destroyJob.data);
  }
}
