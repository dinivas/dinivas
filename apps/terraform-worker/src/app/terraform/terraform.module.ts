import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TerraformProcessor } from './terraform.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'terraform-module',
    }),
  ],
  providers: [TerraformProcessor],
})
export class TerraformModule {}
