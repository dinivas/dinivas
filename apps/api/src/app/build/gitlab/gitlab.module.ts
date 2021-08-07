import { ConsulModule } from './../../network/consul/consul.module';
import { CloudproviderModule } from './../../cloudprovider/cloudprovider.module';
import { TerraformStateModule } from './../../terraform/terraform-state/terraform-state.module';
import { TerraformModule } from './../../terraform/terraform.module';
import { CoreModule } from './../../core/core.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gitlab } from './gitlab.entity';
import { Module } from '@nestjs/common';
import { GitlabController } from './gitlab.controller';
import { GitlabService } from './gitlab.service';
import { GitlabTerraformTasksProcessor } from './gitlab-terraform-tasks.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([Gitlab]),
    CoreModule,
    TerraformModule,
    TerraformStateModule,
    CloudproviderModule,
    ConsulModule,
  ],
  controllers: [GitlabController],
  providers: [GitlabService, GitlabTerraformTasksProcessor],
  exports: [GitlabService],
})
export class GitlabModule {}
