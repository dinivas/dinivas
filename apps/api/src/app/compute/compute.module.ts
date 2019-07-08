import { Module } from '@nestjs/common';
import { ImagesModule } from './images/images.module';

@Module({
  imports: [ImagesModule]
})
export class ComputeModule {}
