import { BasicAuthStrategy } from './auth/basic-auth.strategy';
import { CoreModule } from './../../core/core.module';
import { Module } from '@nestjs/common';
import { TerraformStateController } from './terraform-state.controller';
import { TerraformStateService } from './terraform-state.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TerraformState } from './terraform-state.entity';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([TerraformState]),
    CoreModule,
    PassportModule
  ],
  controllers: [TerraformStateController],
  providers: [TerraformStateService, BasicAuthStrategy],
  exports: [TerraformStateService]
})
export class TerraformStateModule {}
