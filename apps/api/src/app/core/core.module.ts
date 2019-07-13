import { CloudApiFactory } from './cloudapi/cloudapi.factory';
import { OpenstackApiService } from './cloudapi/openstack.api.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [],
  providers: [OpenstackApiService, CloudApiFactory],
  exports: [OpenstackApiService, CloudApiFactory]
})
export class CoreModule {}
