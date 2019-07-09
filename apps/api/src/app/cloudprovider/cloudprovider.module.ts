import { Module } from '@nestjs/common';
import { CloudproviderController } from './cloudprovider.controller';

@Module({
  controllers: [CloudproviderController]
})
export class CloudproviderModule {}
