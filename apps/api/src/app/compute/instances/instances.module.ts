import { TerraformModule } from './../../terraform/terraform.module';
import { CqrsModule } from '@nestjs/cqrs';
import { CloudproviderModule } from './../../cloudprovider/cloudprovider.module';
import { ConsulModule } from './../../network/consul/consul.module';
import { CommandHandlers } from './commands/handlers/index';
import { TerraformStateModule } from './../../terraform/terraform-state/terraform-state.module';
import { Instance } from './instance.entity';
import { Cloudprovider } from './../../cloudprovider/cloudprovider.entity';
import { CoreModule } from './../../core/core.module';
import { Module } from '@nestjs/common';
import { InstancesService } from './instances.service';
import { InstancesController } from './instances.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cloudprovider, Instance]),
    CoreModule,
    CqrsModule,
    TerraformModule,
    TerraformStateModule,
    ConsulModule,
    CloudproviderModule
  ],
  controllers: [InstancesController],
  providers: [InstancesService, ...CommandHandlers],
  exports: [InstancesService]
})
export class InstancesModule {}
