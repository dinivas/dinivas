import { Module } from '@nestjs/common';
import { TerraformTasksProcessor } from './terraform-tasks.processor';
import { TerraformStateModule } from './terraform-state/terraform-state.module';
import { BullModule } from '@nestjs/bull';
import { BULL_TERRAFORM_MODULE_QUEUE } from '@dinivas/api-interfaces';
import { CoreModule } from '../core/core.module';

const terraformModuleQueue = BullModule.registerQueue({
  name: BULL_TERRAFORM_MODULE_QUEUE,
});

@Module({
  imports: [TerraformStateModule, terraformModuleQueue, CoreModule],
  providers: [TerraformTasksProcessor],
  exports: [terraformModuleQueue, TerraformTasksProcessor],
})
export class TerraformModule {}
