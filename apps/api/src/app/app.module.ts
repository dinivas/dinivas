import { RolesGuard } from './auth/roles.guard';
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
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [InfoController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    }],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void | MiddlewareConsumer {
    HelmetMiddleware.configure({})
    CsurfMiddleware.configure({ cookie: true })
    consumer
      .apply(HelmetMiddleware).forRoutes('/*')
      .apply(CompressionMiddleware).forRoutes('/*')
      .apply(CookieParserMiddleware).forRoutes('/*')
      .apply(CsurfMiddleware).forRoutes('/*');
    if (!environment.production) {
      MorganMiddleware.configure('dev');
      consumer.apply(MorganMiddleware).forRoutes('/*');
    }

    //consumer.apply(require('./auth/keycloak').keycloak.protect('real:admin')).forRoutes(InfoController)
    // // var keycloak = new Keycloak({}, environment.keyCloakConfig);
    // var keycloak = new Keycloak({});
    // keycloak.middleware();
    // consumer
    //   .apply(keycloak.checkSso())
    //   //.apply(keycloak.protect('realm:admin', {response_mode: 'token'}))
    //   //.apply(keycloak.protect('admin'))
    //   .forRoutes(InfoController);
  }

}
