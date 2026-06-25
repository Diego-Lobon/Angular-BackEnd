import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: '*',
    exposedHeaders: ['Content-Disposition', 'X-File-Name'],
  });

  app.useGlobalPipes(new ValidationPipe());

  // Configuración de archivos estáticos robusta
  const staticPath = join(process.cwd(), 'public');
  app.use('/uploads', express.static(join(staticPath, 'uploads')));

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
}
bootstrap();
