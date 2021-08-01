import {
  BULL_TERRAFORM_MODULE_QUEUE,
  PlanProjectCommand,
  ApplyProjectCommand,
  DestroyProjectCommand,
  PlanJenkinsCommand,
  ApplyJenkinsCommand,
  DestroyJenkinsCommand,
  PlanRabbitMQCommand,
  DestroyRabbitMQCommand,
  ApplyRabbitMQCommand
} from '@dinivas/api-interfaces';
import { Job } from 'bull';
import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { PlanProjectHandler } from '../projects/plan-project.handler';
import { ApplyProjectHandler } from '../projects/apply-project.handler';
import { DestroyProjectHandler } from '../projects/destroy-project.handler';
import { PlanJenkinsHandler } from '../build/jenkins/plan-jenkins.handler';
import { ApplyJenkinsHandler } from '../build/jenkins/apply-jenkins.handler';
import { DestroyJenkinsHandler } from '../build/jenkins/destroy-jenkins.handler';
import { DestroyRabbitMQHandler } from './../messaging/rabbitmq/destroy-rabbitmq.handler';
import { ApplyRabbitMQHandler } from './../messaging/rabbitmq/apply-rabbitmq.handler';
import { PlanRabbitMQHandler } from './../messaging/rabbitmq/plan-rabbitmq.handler';

@Processor(BULL_TERRAFORM_MODULE_QUEUE)
export class TerraformProcessor {
  private readonly logger = new Logger(TerraformProcessor.name);

  constructor(
    private readonly planProjectHandler: PlanProjectHandler,
    private readonly applyProjectHandler: ApplyProjectHandler,
    private readonly destroyProjectHandler: DestroyProjectHandler,
    private readonly planJenkinsHandler: PlanJenkinsHandler,
    private readonly applyJenkinsHandler: ApplyJenkinsHandler,
    private readonly destroyJenkinsHandler: DestroyJenkinsHandler,
    private readonly planRabbitMQHandler: PlanRabbitMQHandler,
    private readonly applyRabbitMQHandler: ApplyRabbitMQHandler,
    private readonly destroyRabbitMQHandler: DestroyRabbitMQHandler
  ) {}

  @Process('plan-project')
  async handleTerraformPlanProject(planJob: Job<PlanProjectCommand>) {
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
  async handleTerraformApplyProject(applyJob: Job<ApplyProjectCommand>) {
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
  async handleTerraformDestroyProject(destroyJob: Job<DestroyProjectCommand>) {
    this.logger.debug(
      `Receive Destroy Job with datas: ${JSON.stringify(destroyJob)}`
    );
    return this.destroyProjectHandler.execute(
      destroyJob,
      DestroyProjectCommand.from(destroyJob.data)
    );
  }

  // Jenkins
  @Process('plan-jenkins')
  async handleTerraformPlanJenkins(planJob: Job<PlanJenkinsCommand>) {
    this.logger.debug(
      `Receive Plan Job [${planJob.id}] with datas: ${JSON.stringify(
        planJob.data as PlanJenkinsCommand
      )}`
    );
    return this.planJenkinsHandler.execute(
      planJob,
      PlanJenkinsCommand.from(planJob.data)
    );
  }

  @Process('apply-jenkins')
  async handleTerraformApplyJenkins(applyJob: Job<ApplyJenkinsCommand>) {
    this.logger.debug(
      `Receive Apply Job [${applyJob.id}]  with datas: ${JSON.stringify(
        applyJob
      )}`
    );
    return this.applyJenkinsHandler.execute(
      applyJob,
      ApplyJenkinsCommand.from(applyJob.data)
    );
  }

  @Process('destroy-jenkins')
  async handleTerraformDestroyJenkins(destroyJob: Job<DestroyJenkinsCommand>) {
    this.logger.debug(
      `Receive Destroy Job with datas: ${JSON.stringify(destroyJob)}`
    );
    return this.destroyJenkinsHandler.execute(
      destroyJob,
      DestroyJenkinsCommand.from(destroyJob.data)
    );
  }
  // RabbitMQ
  @Process('plan-rabbitmq')
  async handleTerraformPlanRabbitMQ(planJob: Job<PlanRabbitMQCommand>) {
    this.logger.debug(
      `Receive Plan Job [${planJob.id}] with datas: ${JSON.stringify(
        planJob.data as PlanRabbitMQCommand
      )}`
    );
    return this.planRabbitMQHandler.execute(
      planJob,
      PlanRabbitMQCommand.from(planJob.data)
    );
  }

  @Process('apply-rabbitmq')
  async handleTerraformApplyRabbitMQ(applyJob: Job<ApplyRabbitMQCommand>) {
    this.logger.debug(
      `Receive Apply Job [${applyJob.id}]  with datas: ${JSON.stringify(
        applyJob
      )}`
    );
    return this.applyRabbitMQHandler.execute(
      applyJob,
      ApplyRabbitMQCommand.from(applyJob.data)
    );
  }

  @Process('destroy-rabbitmq')
  async handleTerraformDestroyRabbitMQ(destroyJob: Job<DestroyRabbitMQCommand>) {
    this.logger.debug(
      `Receive Destroy Job with datas: ${JSON.stringify(destroyJob)}`
    );
    return this.destroyRabbitMQHandler.execute(
      destroyJob,
      DestroyRabbitMQCommand.from(destroyJob.data)
    );
  }
}
