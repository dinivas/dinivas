import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TerraformStateModule } from './terraform-state/terraform-state.module';
import { TerraformGateway } from './terraform.gateway';
import { TerraformService } from './terraform.service';

@Module({
  imports: [
    TerraformStateModule,
    BullModule.registerQueue({
      name: 'terraform-module',
    }),
  ],
  providers: [TerraformGateway, TerraformService],
  exports: [TerraformGateway, TerraformService],
})
export class TerraformModule {}
