import { RabbitMQService } from './rabbitmq.service';
import { RabbitMQController } from './rabbitmq.controller';
import { ConsulModule } from './../../network/consul/consul.module';
import { CloudproviderModule } from './../../cloudprovider/cloudprovider.module';
import { TerraformStateModule } from './../../terraform/terraform-state/terraform-state.module';
import { CoreModule } from './../../core/core.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RabbitMQ } from './rabbitmq.entity';
import { TerraformModule } from '../../terraform/terraform.module';
import { RabbitMQTerraformTasksProcessor } from './rabbitmq-terraform-tasks.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([RabbitMQ]),
    CoreModule,
    TerraformModule,
    TerraformStateModule,
    CloudproviderModule,
    ConsulModule,
  ],
  controllers: [RabbitMQController],
  providers: [RabbitMQService, RabbitMQTerraformTasksProcessor],
  exports: [RabbitMQService],
})
export class RabbitmqModule {}
