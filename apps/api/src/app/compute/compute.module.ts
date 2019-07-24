import { Module } from '@nestjs/common';
import { ImagesModule } from './images/images.module';
import { InstancesModule } from './instances/instances.module';
import { DisksModule } from './disks/disks.module';

@Module({
  imports: [ImagesModule, InstancesModule, DisksModule]
})
export class ComputeModule {}
