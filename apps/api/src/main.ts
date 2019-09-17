import { API_PREFFIX } from './app/constants';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { AllExceptionsFilter } from './app/core/all-exceptions.filter';
import { CONSTANT } from '@dinivas/dto';
import { setupSwagger } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // we disable default bodyparser because http-proxy-middleware not compatible with this
    bodyParser: false,
    cors: {
      exposedHeaders: [
        CONSTANT.HTTP_HEADER_AUTH_ERROR,
        CONSTANT.HTTP_HEADER_AUTH_REQUIRED_PERMISSIONS,
        CONSTANT.HTTP_HEADER_PROJECT_UNKNOWN
      ]
    }
  });
  app.useGlobalFilters(new AllExceptionsFilter());

  setupSwagger(app);

  app.setGlobalPrefix(API_PREFFIX);
  const port = process.env.PORT || 3333;
  await app.listen(port, () => {
    console.log('Listening at http://localhost:' + port + '/' + API_PREFFIX);
  });
}

bootstrap();
