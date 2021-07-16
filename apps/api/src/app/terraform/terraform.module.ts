import { Module } from '@nestjs/common';
import { TerraformStateModule } from './terraform-state/terraform-state.module';
import { TerraformGateway } from './terraform.gateway';

@Module({
  imports: [TerraformStateModule],
  providers: [TerraformGateway],
  exports: [TerraformGateway]
})
export class TerraformModule {}
