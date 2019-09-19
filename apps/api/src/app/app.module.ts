import { ConfigService } from './core/config/config.service';
import { Jenkins, JenkinsSlaveGroup } from './build/jenkins/jenkins.entity';
import { BuildModule } from './build/build.module';
import { API_PREFFIX } from './constants';
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
import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod
} from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import {
  HelmetMiddleware,
  HelmetContentSecurityPolicyMiddleware
} from '@nest-middlewares/helmet';
import { CompressionMiddleware } from '@nest-middlewares/compression';
import { CookieParserMiddleware } from '@nest-middlewares/cookie-parser';
import { CsurfMiddleware } from '@nest-middlewares/csurf';
import { MorganMiddleware } from '@nest-middlewares/morgan';
import { AppService } from './app.service';
import { ComputeModule } from './compute/compute.module';
import { CloudproviderModule } from './cloudprovider/cloudprovider.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ProjectsModule } from './projects/projects.module';
import { IamModule } from './iam/iam.module';
import { TerraformModule } from './terraform/terraform.module';
import * as httpProxy from 'http-proxy-middleware';
import { json } from 'body-parser';
import { IConfig } from 'config';

if (!process.env['NODE_CONFIG_DIR']) {
  process.env['NODE_CONFIG_DIR'] = __dirname + '/../../../../cfonfig/';
}
export const config: IConfig = require('config');

const ormConfigJson: TypeOrmModuleOptions = config.get('dinivas.orm.config');

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...ormConfigJson,
      entities: [
        Cloudprovider,
        Project,
        TerraformState,
        Jenkins,
        JenkinsSlaveGroup
      ]
    }),
    ComputeModule,
    CloudproviderModule,
    ProjectsModule,
    IamModule,
    TerraformModule,
    CoreModule,
    BuildModule,
    StatusMonitorModule.setUp(statusMonitorConfig)
  ],
  controllers: [InfoController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthzGuard
    },
    TerraformGateway
  ]
})
export class AppModule implements NestModule {
  constructor(private configService: ConfigService) {}
  configure(consumer: MiddlewareConsumer): void | MiddlewareConsumer {
    // Ansible Galaxy proxy, must be before body-parser
    consumer
      .apply(
        httpProxy([`/${API_PREFFIX}/ansible-galaxy`], {
          target: `${this.configService.get('ansible_galaxy.url')}`,
          logLevel: 'debug',
          changeOrigin: false,
          prependPath: true,
          pathRewrite: { '^/api/v1/ansible-galaxy': '' }
        })
      )
      .forRoutes('ansible-galaxy/*');
    // Add manually body-parser because we disabled it in main.ts
    const jsonParseMiddleware = json();
    consumer
      .apply((req: any, res: any, next: any) => {
        jsonParseMiddleware(req, res, next);
      })
      .forRoutes('/*');

    HelmetMiddleware.configure({
      frameguard: {
        action: 'allow-from',
        domain: 'http://localhost:4200'
      }
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
      .apply(Keycloak.middleware(), Keycloak.checkSso())
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
