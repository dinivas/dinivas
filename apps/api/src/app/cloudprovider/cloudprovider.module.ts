import { Cloudprovider } from './cloudprovider.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Module } from '@nestjs/common';
import { CloudproviderController } from './cloudprovider.controller';
import { CloudproviderService } from './cloudprovider.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cloudprovider])
  ],
  controllers: [CloudproviderController],
  providers: [CloudproviderService]
})
export class CloudproviderModule {}
