import { CoreModule } from './../../core/core.module';
import { Cloudprovider } from './../../cloudprovider/cloudprovider.entity';
import { Module } from '@nestjs/common';
import { DisksController } from './disks.controller';
import { DisksService } from './disks.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Cloudprovider]), CoreModule],
  controllers: [DisksController],
  providers: [DisksService],
  exports: [DisksService]
})
export class DisksModule {}
