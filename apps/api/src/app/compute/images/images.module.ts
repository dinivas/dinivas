import { Module } from '@nestjs/common';
import { ImagesController } from './images.controller';

@Module({
  controllers: [ImagesController]
})
export class ImagesModule {}
