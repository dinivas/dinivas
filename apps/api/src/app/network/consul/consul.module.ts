import { Consul } from './consul.entity';
import { CloudproviderModule } from './../../cloudprovider/cloudprovider.module';
import { TerraformStateModule } from './../../terraform/terraform-state/terraform-state.module';
import { TerraformModule } from './../../terraform/terraform.module';
import { CoreModule } from './../../core/core.module';
import { Module } from '@nestjs/common';
import { ConsulController } from './consul.controller';
import { ConsulService } from './consul.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Consul]),
    CoreModule,
    TerraformModule,
    TerraformStateModule,
    CloudproviderModule,
  ],
  controllers: [ConsulController],
  providers: [ConsulService],
  exports: [ConsulService],
})
export class ConsulModule {}
