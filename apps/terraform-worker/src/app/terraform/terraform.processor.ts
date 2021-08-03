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
  ApplyRabbitMQCommand,
  ApplyInstanceCommand,
  PlanInstanceCommand,
  DestroyInstanceCommand,
  PlanConsulCommand,
  ApplyConsulCommand,
  DestroyConsulCommand,
} from '@dinivas/api-interfaces';
import { Job } from 'bull';
import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import {
  PlanProjectHandler,
  ApplyProjectHandler,
  DestroyProjectHandler,
} from '../projects';
import {
  PlanJenkinsHandler,
  ApplyJenkinsHandler,
  DestroyJenkinsHandler,
} from '../build/jenkins';
import {
  PlanRabbitMQHandler,
  ApplyRabbitMQHandler,
  DestroyRabbitMQHandler,
} from './../messaging/rabbitmq';
import {
  PlanInstanceHandler,
  ApplyInstanceHandler,
  DestroyInstanceHandler,
} from './../compute/instances';
import {
  PlanConsulHandler,
  ApplyConsulHandler,
  DestroyConsulHandler,
} from './../network/consul';

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
    private readonly destroyRabbitMQHandler: DestroyRabbitMQHandler,
    private readonly planInstanceHandler: PlanInstanceHandler,
    private readonly applyInstanceHandler: ApplyInstanceHandler,
    private readonly destroyInstanceHandler: DestroyInstanceHandler,
    private readonly planConsulHandler: PlanConsulHandler,
    private readonly applyConsulHandler: ApplyConsulHandler,
    private readonly destroyConsulHandler: DestroyConsulHandler
  ) {}

  // Project
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
  async handleTerraformDestroyRabbitMQ(
    destroyJob: Job<DestroyRabbitMQCommand>
  ) {
    this.logger.debug(
      `Receive Destroy Job with datas: ${JSON.stringify(destroyJob)}`
    );
    return this.destroyRabbitMQHandler.execute(
      destroyJob,
      DestroyRabbitMQCommand.from(destroyJob.data)
    );
  }
  // Instance
  @Process('plan-instance')
  async handleTerraformPlanInstance(planJob: Job<PlanInstanceCommand>) {
    this.logger.debug(
      `Receive Plan Job [${planJob.id}] with datas: ${JSON.stringify(
        planJob.data as PlanInstanceCommand
      )}`
    );
    return this.planInstanceHandler.execute(
      planJob,
      PlanInstanceCommand.from(planJob.data)
    );
  }

  @Process('apply-instance')
  async handleTerraformApplyInstance(applyJob: Job<ApplyInstanceCommand>) {
    this.logger.debug(
      `Receive Apply Job [${applyJob.id}]  with datas: ${JSON.stringify(
        applyJob
      )}`
    );
    return this.applyInstanceHandler.execute(
      applyJob,
      ApplyInstanceCommand.from(applyJob.data)
    );
  }

  @Process('destroy-instance')
  async handleTerraformDestroyInstance(
    destroyJob: Job<DestroyInstanceCommand>
  ) {
    this.logger.debug(
      `Receive Destroy Job with datas: ${JSON.stringify(destroyJob)}`
    );
    return this.destroyInstanceHandler.execute(
      destroyJob,
      DestroyInstanceCommand.from(destroyJob.data)
    );
  }
  // Consul
  @Process('plan-consul')
  async handleTerraformPlanConsul(planJob: Job<PlanConsulCommand>) {
    this.logger.debug(
      `Receive Plan Job [${planJob.id}] with datas: ${JSON.stringify(
        planJob.data as PlanConsulCommand
      )}`
    );
    return this.planConsulHandler.execute(
      planJob,
      PlanConsulCommand.from(planJob.data)
    );
  }

  @Process('apply-consul')
  async handleTerraformApplyConsul(applyJob: Job<ApplyConsulCommand>) {
    this.logger.debug(
      `Receive Apply Job [${applyJob.id}]  with datas: ${JSON.stringify(
        applyJob
      )}`
    );
    return this.applyConsulHandler.execute(
      applyJob,
      ApplyConsulCommand.from(applyJob.data)
    );
  }

  @Process('destroy-consul')
  async handleTerraformDestroyConsul(destroyJob: Job<DestroyConsulCommand>) {
    this.logger.debug(
      `Receive Destroy Job with datas: ${JSON.stringify(destroyJob)}`
    );
    return this.destroyConsulHandler.execute(
      destroyJob,
      DestroyConsulCommand.from(destroyJob.data)
    );
  }
}
