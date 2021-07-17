/* eslint-disable @typescript-eslint/no-empty-function */
import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

@Processor('terraform-module')
export class TerraformProcessor {
  private readonly logger = new Logger(TerraformProcessor.name);

  constructor() {}

  @Process('plan')
  async handleTerraformPlan(planJob: Job) {
    this.logger.debug('Receive Plan Job', JSON.stringify(planJob));
  }

  @Process('apply')
  async handleTerraformApply(applyJob: Job) {
    this.logger.debug('Receive Apply Job', JSON.stringify(applyJob));
  }

  @Process('destroy')
  async handleTerraformDestroy(destroyJob: Job) {
    this.logger.debug('Receive Destroy Job', JSON.stringify(destroyJob));
  }
}
