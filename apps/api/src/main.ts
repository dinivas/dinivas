import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { AllExceptionsFilter } from './app/core/all-exceptions.filter';
import { setupSwagger } from 'apps/api/src/swagger';
import {
  CONSTANT
} from '@dinivas/dto';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      exposedHeaders: [
        CONSTANT.HTTP_HEADER_AUTH_ERROR,
        CONSTANT.HTTP_HEADER_AUTH_REQUIRED_PERMISSIONS,
        CONSTANT.HTTP_HEADER_PROJECT_UNKNOWN
      ]
    }
  });
  app.useGlobalFilters(new AllExceptionsFilter());

  const globalPrefix = 'api/v1';
  setupSwagger(app);

  app.setGlobalPrefix(globalPrefix);
  const port = process.env.port || 3333;
  await app.listen(port, () => {
    console.log('Listening at http://localhost:' + port + '/' + globalPrefix);
  });
}

bootstrap();
