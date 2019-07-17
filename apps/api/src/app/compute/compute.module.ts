import { Module } from '@nestjs/common';
import { ImagesModule } from './images/images.module';
import { InstancesModule } from './instances/instances.module';

@Module({
  imports: [ImagesModule, InstancesModule]
})
export class ComputeModule {}
