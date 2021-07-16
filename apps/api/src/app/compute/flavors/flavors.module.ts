import { Cloudprovider } from './../../cloudprovider/cloudprovider.entity';
import { CoreModule } from './../../core/core.module';
import { Module } from '@nestjs/common';
import { FlavorsService } from './flavors.service';
import { FlavorsController } from './flavors.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Cloudprovider]), CoreModule],
  providers: [FlavorsService],
  controllers: [FlavorsController],
  exports: [FlavorsService]
})
export class FlavorsModule {}
