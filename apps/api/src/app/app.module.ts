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

@Module({
  imports: [],
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
  }

}
