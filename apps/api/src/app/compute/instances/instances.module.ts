import { Cloudprovider } from './../../cloudprovider/cloudprovider.entity';
import { CoreModule } from './../../core/core.module';
import { Module } from '@nestjs/common';
import { InstancesService } from './instances.service';
import { InstancesController } from './instances.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Cloudprovider]), CoreModule],
  providers: [InstancesService],
  controllers: [InstancesController],
  exports: [InstancesService]
})
export class InstancesModule {}
