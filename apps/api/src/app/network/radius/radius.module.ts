import { Module } from '@nestjs/common';
import { RadiusController } from './radius.controller';
import { RadiusService } from './radius.service';

@Module({
  controllers: [RadiusController],
  providers: [RadiusService]
})
export class RadiusModule {}
