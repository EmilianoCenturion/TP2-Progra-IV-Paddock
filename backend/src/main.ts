import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes( new ValidationPipe({ whitelist: true, stopAtFirstError: true }));
  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
