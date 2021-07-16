import { Module } from '@nestjs/common';
import { ImagesModule } from './images/images.module';
import { InstancesModule } from './instances/instances.module';
import { DisksModule } from './disks/disks.module';
import { FlavorsModule } from './flavors/flavors.module';

@Module({
  imports: [ImagesModule, InstancesModule, DisksModule, FlavorsModule]
})
export class ComputeModule {}
