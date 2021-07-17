import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StatusMonitorModule } from 'nest-status-monitor';

import { statusMonitorConfig } from './utils/status-monitor';
import { WSGateway } from './wsgateway';
import configConfiguration from './config.configuration';
import { TerraformModule } from './terraform/terraform.module';

const TASKS_REDIS_CONFIG_ROOT_KEY = 'dinivas.tasks.redis';

@Module({
  imports: [
    StatusMonitorModule.setUp(statusMonitorConfig),
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: true,
      load: [configConfiguration],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>(
            `${TASKS_REDIS_CONFIG_ROOT_KEY}.host`,
            'localhost'
          ),
          port: configService.get<number>(
            `${TASKS_REDIS_CONFIG_ROOT_KEY}.port`,
            6379
          ),
        },
      }),
      inject: [ConfigService],
    }),
    TerraformModule
  ],
  controllers: [],
  providers: [WSGateway],
})
export class AppModule {}
