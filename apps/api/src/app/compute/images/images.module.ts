import { CloudproviderModule } from './../../cloudprovider/cloudprovider.module';
import { CoreModule } from './../../core/core.module';
import { Cloudprovider } from './../../cloudprovider/cloudprovider.entity';
import { Module } from '@nestjs/common';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImagesPackerTasksProcessor } from './images-packer-tasks.processor';
import { BULL_PACKER_BUILD_QUEUE } from '@dinivas/api-interfaces';
import { BullModule } from '@nestjs/bull';

const packerBuildQueue = BullModule.registerQueue({
  name: BULL_PACKER_BUILD_QUEUE,
});

@Module({
  imports: [
    TypeOrmModule.forFeature([Cloudprovider]),
    CoreModule,
    CloudproviderModule,
    packerBuildQueue,
  ],
  controllers: [ImagesController],
  providers: [ImagesService, ImagesPackerTasksProcessor],
  exports: [ImagesService, packerBuildQueue],
})
export class ImagesModule {}
