import { TerraformModule } from './../../terraform/terraform.module';
import { CommandHandlers } from './commands/handlers/index';
import { CqrsModule } from '@nestjs/cqrs';
import { CloudproviderModule } from './../../cloudprovider/cloudprovider.module';
import { TerraformStateModule } from './../../terraform/terraform-state/terraform-state.module';
import { CoreModule } from './../../core/core.module';
import { Jenkins } from './jenkins.entity';
import { Module } from '@nestjs/common';
import { JenkinsController } from './jenkins.controller';
import { JenkinsService } from './jenkins.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Jenkins]),
    CoreModule,
    CqrsModule,
    TerraformModule,
    TerraformStateModule,
    CloudproviderModule
  ],
  controllers: [JenkinsController],
  providers: [JenkinsService, ...CommandHandlers],
  exports: [JenkinsService]
})
export class JenkinsModule {}
