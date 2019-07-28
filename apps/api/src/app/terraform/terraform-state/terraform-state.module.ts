import { CoreModule } from './../../core/core.module';
import { Module } from '@nestjs/common';
import { TerraformStateController } from './terraform-state.controller';
import { TerraformStateService } from './terraform-state.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TerraformState } from './terraform-state.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TerraformState]), CoreModule],
  controllers: [TerraformStateController],
  providers: [TerraformStateService]
})
export class TerraformStateModule {}
