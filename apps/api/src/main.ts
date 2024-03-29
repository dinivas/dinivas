import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AllExceptionsFilter } from './app/core/all-exceptions.filter';
import { setupSwagger } from './swagger';
import { API_PREFFIX, CONSTANT } from '@dinivas/api-interfaces';
import { AppModule } from './app/app.module';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // we disable default bodyparser because http-proxy-middleware not compatible with this
    bodyParser: false,
    cors: {
      exposedHeaders: [
        CONSTANT.HTTP_HEADER_AUTH_ERROR,
        CONSTANT.HTTP_HEADER_AUTH_REQUIRED_PERMISSIONS,
        CONSTANT.HTTP_HEADER_PROJECT_UNKNOWN,
      ],
    },
  });
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter());

  setupSwagger(app);

  app.setGlobalPrefix(API_PREFFIX);
  app.enableShutdownHooks();
  const port = process.env.PORT || 3333;
  await app.listen(port, () => {
    Logger.log(`Listening at http://localhost:${port}/${API_PREFFIX}`);
  });
}

bootstrap();
