import { Module } from '@nestjs/common';
import { ConsulModule } from './consul/consul.module';
import { RadiusModule } from './radius/radius.module';

@Module({
  imports: [ConsulModule, RadiusModule]
})
export class NetworkModule {}
