import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import { AllExceptionsFilter } from './app/core/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      exposedHeaders: ['X-Dinivas-Auth-Error', 'X-Dinivas-Auth-Required-Permissions']
    }
  });
  app.useGlobalFilters(new AllExceptionsFilter());

  const globalPrefix = 'api/v1';

  // Documentation
  const options = new DocumentBuilder()
    .setTitle('Dinivas API')
    .setDescription('Dinivas API description')
    .setVersion('1.0')
    .setBasePath('/api/v1')
    .addBearerAuth()
    //.addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  app.setGlobalPrefix(globalPrefix);
  const port = process.env.port || 3333;
  await app.listen(port, () => {
    console.log('Listening at http://localhost:' + port + '/' + globalPrefix);
  });
}

bootstrap();
