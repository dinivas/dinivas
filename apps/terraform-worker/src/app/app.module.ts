import { HttpModule, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StatusMonitorModule } from 'nest-status-monitor';

import { statusMonitorConfig } from './utils/status-monitor';
import configConfiguration from './config.configuration';
import { CommandHandlers as ProjectsCommandHandlers } from './projects';
import { CommandHandlers as ConsulCommandHandlers } from './network';
import { CommandHandlers as InstancesCommandHandlers } from './compute/instances';
import { CommandHandlers as RabbitMQCommandHandlers } from './messaging/rabbitmq';
import { ConfigurationService } from './configuration.service';
import { GitService } from './git/git.service';
import { TerraformStateService } from './terraform-state.service';
import { CqrsModule } from '@nestjs/cqrs';
import { BULL_TERRAFORM_MODULE_QUEUE } from '@dinivas/api-interfaces';
import { WSGateway } from './wsgateway';
import { TerraformProcessor } from './terraform/terraform.processor';

const TASKS_REDIS_CONFIG_ROOT_KEY = 'dinivas.tasks.redis';
const TF_STATE_CONFIG_ROOT_KEY = 'dinivas.terraform.state';

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
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        timeout: configService.get<number>(
          `${TF_STATE_CONFIG_ROOT_KEY}.http_timeout`,
          5000
        ),
        maxRedirects: configService.get<number>(
          `${TF_STATE_CONFIG_ROOT_KEY}.http_max_redirects`,
          5
        ),
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue(
      {
        name: BULL_TERRAFORM_MODULE_QUEUE,
      }
    ),
    CqrsModule,
  ],
  controllers: [],
  providers: [
    ConfigurationService,
    WSGateway,
    GitService,
    TerraformProcessor,
    TerraformStateService,
    ...ProjectsCommandHandlers,
    ...ConsulCommandHandlers,
    ...InstancesCommandHandlers,
    ...RabbitMQCommandHandlers,
  ],
})
export class AppModule {}
