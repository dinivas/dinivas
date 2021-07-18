import { ConsulModule } from './../network/consul/consul.module';
import { TerraformStateModule } from './../terraform/terraform-state/terraform-state.module';
import { TerraformModule } from './../terraform/terraform.module';
import { CloudproviderModule } from './../cloudprovider/cloudprovider.module';
import { CoreModule } from './../core/core.module';
import { Project } from './project.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { ProjectTerraformTasksProcessor } from './project-terraform-tasks.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project]),
    CoreModule,
    CloudproviderModule,
    TerraformModule,
    TerraformStateModule,
    ConsulModule,
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService, ProjectTerraformTasksProcessor],
  exports: [ProjectsService],
})
export class ProjectsModule {}
