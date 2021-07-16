import { ConsulModule } from './../network/consul/consul.module';
import { TerraformStateModule } from './../terraform/terraform-state/terraform-state.module';
import { TerraformModule } from './../terraform/terraform.module';
import { CloudproviderModule } from './../cloudprovider/cloudprovider.module';
import { CommandHandlers } from './commands/handlers/index';
import { CoreModule } from './../core/core.module';
import { Project } from './project.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project]),
    CoreModule,
    CloudproviderModule,
    CqrsModule,
    TerraformModule,
    TerraformStateModule,
    ConsulModule
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService, ...CommandHandlers],
  exports: [ProjectsService]
})
export class ProjectsModule {}
