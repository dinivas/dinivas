import {
  BULL_TERRAFORM_MODULE_QUEUE,
  ConsulDTO,
  ProjectDTO,
  TerraformApplyEvent,
  TerraformDestroyEvent,
  TerraformPlanEvent,
} from '@dinivas/api-interfaces';
import { InjectQueue, OnGlobalQueueCompleted, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { TerraformGateway } from '../terraform/terraform.gateway';
import { Queue } from 'bull';

@Processor(BULL_TERRAFORM_MODULE_QUEUE)
export class TerraformTasksProcessor {
  private readonly logger = new Logger(TerraformTasksProcessor.name);
  constructor(
    @InjectQueue(BULL_TERRAFORM_MODULE_QUEUE)
    private readonly terraformModuleQueue: Queue,
    private readonly terraformGateway: TerraformGateway
  ) {}

  @OnGlobalQueueCompleted()
  async onGlobalCompleted(jobId: number, receivedResult: any) {
    // Received result is in string
    const result: { module: string; eventCode: string; event: any } =
      JSON.parse(receivedResult);
    if (result.eventCode.startsWith('planEvent-')) {
      const planEvent = result.event as TerraformPlanEvent<any>;
      const job = await this.terraformModuleQueue.getJob(jobId);
      this.logger.debug(
        `[PLAN] (Global) on completed: job  ${job.id}, eventCode ${result.eventCode} -> result workingDir=[${planEvent.workingDir}], source [${planEvent.source}], planResult: ( Nb resources changed: [${planEvent.planResult.resource_changes.length}], Planned Values: [${planEvent.planResult.planned_values.outputs}])`
      );
      this.terraformGateway.emit(result.eventCode, planEvent);
    }
    if (result.eventCode.startsWith('applyEvent-')) {
      const applyEvent = result.event as TerraformApplyEvent<any>;
      const job = await this.terraformModuleQueue.getJob(jobId);
      this.logger.debug(
        `[APPLY] (Global) on completed: job  ${job.id}, eventCode ${result.eventCode} -> result  source [${applyEvent.source}], planResult: ( Plan Values: [${applyEvent.stateResult.values.outputs}])`
      );
      this.terraformGateway.emit(result.eventCode, applyEvent);
    }
    if (result.eventCode.startsWith('destroyEvent-')) {
      const destroyEvent = result.event as TerraformDestroyEvent<any>;
      const job = await this.terraformModuleQueue.getJob(jobId);
      this.logger.debug(
        `[DESTROY] (Global) on completed: job  ${job.id}, eventCode ${result.eventCode} -> result  source [${destroyEvent.source}]`
      );
      // switch (result.module) {
      //   case 'project':
      //     await this.consulService.delete(
      //       (
      //         destroyEvent.source as {
      //           project: ProjectDTO;
      //           consul: ConsulDTO;
      //         }
      //       ).consul.id
      //     );
      //     await this.projectService.delete(
      //       (destroyEvent.source as ProjectDTO).id
      //     );
      //     break;

      //   default:
      //     break;
      // }
      this.terraformGateway.emit(result.eventCode, destroyEvent);
    }
  }
}
