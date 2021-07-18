import { Instance } from './compute/instances/instance.entity';
import { MessagingModule } from './messaging/messaging.module';
import { AdminIamModule } from './admin-iam/admin-iam.module';
import { Consul } from './network/consul/consul.entity';
import { NetworkModule } from './network/network.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Jenkins, JenkinsSlaveGroup } from './build/jenkins/jenkins.entity';
import { BuildModule } from './build/build.module';
import { TerraformGateway } from './terraform/terraform.gateway';
import { statusMonitorConfig } from './utils/status-monitor';
import { CoreModule } from './core/core.module';
import { StatusMonitorModule } from 'nest-status-monitor';
import { TerraformState } from './terraform/terraform-state/terraform-state.entity';
import { IamController } from './iam/iam.controller';
import { InstancesController } from './compute/instances/instances.controller';
import { DisksController } from './compute/disks/disks.controller';
import { ProjectsController } from './projects/projects.controller';
import { ImagesController } from './compute/images/images.controller';
import { CloudproviderController } from './cloudprovider/cloudprovider.controller';
import { Keycloak } from './auth/keycloak';
import { ProjectProviderMiddleware } from './core/middlewares/project-provider/project-provider.middleware';
import { Project } from './projects/project.entity';
import { Cloudprovider } from './cloudprovider/cloudprovider.entity';
import { AuthzGuard } from './auth/authz.guard';
import { environment } from './../environments/environment';
import { InfoController } from './info.controller';
import { BullModule, InjectQueue } from '@nestjs/bull';
import { ExpressAdapter } from '@bull-board/express';
import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { HelmetMiddleware } from '@nest-middlewares/helmet';
import { CompressionMiddleware } from '@nest-middlewares/compression';
import { CookieParserMiddleware } from '@nest-middlewares/cookie-parser';
import { CsurfMiddleware } from '@nest-middlewares/csurf';
import { MorganMiddleware } from '@nest-middlewares/morgan';
import { AppService } from './app.service';
import { ComputeModule } from './compute/compute.module';
import { CloudproviderModule } from './cloudprovider/cloudprovider.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsModule } from './projects/projects.module';
import { IamModule } from './iam/iam.module';
import { TerraformModule } from './terraform/terraform.module';
import * as httpProxy from 'http-proxy-middleware';
import { json } from 'body-parser';
import { RabbitMQ } from './messaging/rabbitmq/rabbitmq.entity';
import configConfiguration from './config.configuration';
import {
  API_PREFFIX,
  BULL_TERRAFORM_MODULE_QUEUE,
} from '@dinivas/api-interfaces';
import { Queue } from 'bull';
if (!process.env['NODE_CONFIG_DIR']) {
  process.env['NODE_CONFIG_DIR'] = __dirname + '/../../../../config/';
}

const ORM_CONFIG_ROOT_KEY = 'dinivas.orm.config';
const TASKS_REDIS_CONFIG_ROOT_KEY = 'dinivas.tasks.redis';
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          ignoreEnvFile: true,
          load: [configConfiguration],
        }),
      ],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>(
          `${ORM_CONFIG_ROOT_KEY}.host`,
          'localhost'
        ),
        port: configService.get<number>(`${ORM_CONFIG_ROOT_KEY}.port`, 5432),
        username: configService.get<string>(
          `${ORM_CONFIG_ROOT_KEY}.username`,
          'postgres'
        ),
        password: configService.get<string>(
          `${ORM_CONFIG_ROOT_KEY}.password`,
          'postgres'
        ),
        database: configService.get<string>(
          `${ORM_CONFIG_ROOT_KEY}.database`,
          'dinivas'
        ),
        synchronize: configService.get<boolean>(
          `${ORM_CONFIG_ROOT_KEY}.synchronize`,
          true
        ),
        logging: configService.get<boolean>(
          `${ORM_CONFIG_ROOT_KEY}.logging`,
          false
        ),
        entities: [
          Cloudprovider,
          Project,
          TerraformState,
          Jenkins,
          JenkinsSlaveGroup,
          Consul,
          RabbitMQ,
          Instance,
        ],
      }),
    }),
    ComputeModule,
    CloudproviderModule,
    ProjectsModule,
    AdminIamModule,
    IamModule,
    TerraformModule,
    CoreModule,
    BuildModule,
    NetworkModule,
    MessagingModule,
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
  ],
  controllers: [InfoController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthzGuard,
    },
    TerraformGateway,
  ],
})
export class AppModule implements NestModule {
  constructor(
    private configService: ConfigService,
    @InjectQueue(BULL_TERRAFORM_MODULE_QUEUE)
    private terraformModuleQueue: Queue
  ) {}
  configure(consumer: MiddlewareConsumer): void | MiddlewareConsumer {
    // Ansible Galaxy proxy, must be before body-parser
    consumer
      .apply(
        httpProxy([`/${API_PREFFIX}/ansible-galaxy`], {
          target: `${this.configService.get('ansible_galaxy.url')}`,
          logLevel: 'debug',
          changeOrigin: false,
          prependPath: true,
          pathRewrite: { '^/api/v1/ansible-galaxy': '' },
        })
      )
      .forRoutes('ansible-galaxy/*');
    // Bull Board routes configuration
    const bullExpressServerAdapter = new ExpressAdapter();
    bullExpressServerAdapter.setBasePath('/bull/queues');
    const { setQueues, replaceQueues } = createBullBoard({
      queues: [
        new BullAdapter(this.terraformModuleQueue, { readOnlyMode: false }),
      ],
      serverAdapter: bullExpressServerAdapter,
    });
    bullExpressServerAdapter.setBasePath(`/${API_PREFFIX}/bull/queues`);
    consumer
      .apply(bullExpressServerAdapter.getRouter())
      .forRoutes(`/bull/queues`);
    // Add manually body-parser because we disabled it in main.ts
    const jsonParseMiddleware = json({ limit: '10mb' });
    consumer
      .apply((req: any, res: any, next: any) => {
        jsonParseMiddleware(req, res, next);
      })
      .forRoutes('/*');

    HelmetMiddleware.configure({
      frameguard: {
        action: 'allow-from',
        domain: 'http://localhost:4200',
      },
    });
    CsurfMiddleware.configure({ cookie: true });
    consumer
      .apply(HelmetMiddleware)
      .forRoutes('/*')
      //.apply(HelmetContentSecurityPolicyMiddleware)
      //.forRoutes('/*')
      .apply(CompressionMiddleware)
      .forRoutes('/*')
      .apply(CookieParserMiddleware)
      .forRoutes('/*')
      .apply(ProjectProviderMiddleware)
      .forRoutes('/*');
    //.apply(CsurfMiddleware)
    //.forRoutes('/*');
    MorganMiddleware.configure(!environment.production ? 'dev' : 'combined');
    consumer.apply(MorganMiddleware).forRoutes('/*');
    // Keycloak Sso middleware
    consumer
      .apply(Keycloak.middleware() as any, Keycloak.checkSso())
      .forRoutes(
        CloudproviderController,
        ImagesController,
        ProjectsController,
        DisksController,
        InstancesController,
        IamController,
        InfoController,
        { path: 'ansible-galaxy', method: RequestMethod.ALL }
      );

    // Keycloak Authz middleware
    //consumer
    //  .apply(AuthzMiddleware)
    //  .forRoutes('/*');
  }
}
