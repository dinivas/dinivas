import { Module } from '@nestjs/common';
import { DroneciController } from './droneci.controller';
import { DroneciService } from './droneci.service';

@Module({
  controllers: [DroneciController],
  providers: [DroneciService]
})
export class DroneciModule {}
