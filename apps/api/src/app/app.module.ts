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
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { HelmetMiddleware } from '@nest-middlewares/helmet';
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

const ormConfigJson: TypeOrmModuleOptions = require('../../../../ormconfig.json');

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...ormConfigJson,
      entities: [Cloudprovider, Project, TerraformState]
    }),
    ComputeModule,
    CloudproviderModule,
    ProjectsModule,
    IamModule,
    TerraformModule
  ],
  controllers: [InfoController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthzGuard
    }
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void | MiddlewareConsumer {
    HelmetMiddleware.configure({});
    CsurfMiddleware.configure({ cookie: true });
    consumer
      .apply(HelmetMiddleware)
      .forRoutes('/*')
      .apply(CompressionMiddleware)
      .forRoutes('/*')
      .apply(CookieParserMiddleware)
      .forRoutes('/*')
      .apply(ProjectProviderMiddleware)
      .forRoutes('/*');
    //.apply(CsurfMiddleware)
    //.forRoutes('/*');
    if (!environment.production) {
      MorganMiddleware.configure('dev');
      consumer.apply(MorganMiddleware).forRoutes('/*');
    }
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
        InfoController
      );

    // Keycloak Authz middleware
    //consumer
    //  .apply(AuthzMiddleware)
    //  .forRoutes('/*');
  }
}
