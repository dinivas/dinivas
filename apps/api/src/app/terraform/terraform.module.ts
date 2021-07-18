import { Module } from '@nestjs/common';
import { TerraformTasksProcessor } from './terraform-tasks.processor';
import { TerraformStateModule } from './terraform-state/terraform-state.module';
import { TerraformGateway } from './terraform.gateway';
import { BullModule } from '@nestjs/bull';
import { BULL_TERRAFORM_MODULE_QUEUE } from '@dinivas/api-interfaces';

const terraformModuleQueue = BullModule.registerQueue({
  name: BULL_TERRAFORM_MODULE_QUEUE,
});

@Module({
  imports: [TerraformStateModule, terraformModuleQueue],
  providers: [TerraformGateway, TerraformTasksProcessor],
  exports: [TerraformGateway, terraformModuleQueue, TerraformTasksProcessor],
})
export class TerraformModule {}
