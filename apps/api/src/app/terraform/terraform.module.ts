import { Module } from '@nestjs/common';
import { TerraformStateModule } from './terraform-state/terraform-state.module';

@Module({
  imports: [TerraformStateModule]
})
export class TerraformModule {}
