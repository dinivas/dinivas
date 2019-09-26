import { CloudproviderModule } from './../../cloudprovider/cloudprovider.module';
import { CqrsModule } from '@nestjs/cqrs';
import { CoreModule } from './../../core/core.module';
import { Cloudprovider } from './../../cloudprovider/cloudprovider.entity';
import { Module } from '@nestjs/common';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuildImageCommandHandler } from './commands/handlers/build-image.handler';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cloudprovider]),
    CoreModule,
    CqrsModule,
    CloudproviderModule
  ],
  controllers: [ImagesController],
  providers: [ImagesService, BuildImageCommandHandler],
  exports: [ImagesService]
})
export class ImagesModule {}
