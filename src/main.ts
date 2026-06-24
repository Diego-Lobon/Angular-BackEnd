import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
// 1. Importaciones necesarias
import { NestExpressApplication } from '@nestjs/platform-express';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  // 2. Especifica el tipo NestExpressApplication
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  // 3. Configura la carpeta pública
  // Esto hace que lo que está en 'public/uploads' sea accesible vía '/uploads'
  app.use('/uploads', express.static(join(process.cwd(), 'public', 'uploads')));

  app.enableCors({
    origin: '*', // o tu dominio
    exposedHeaders: ['Content-Disposition', 'X-File-Name'], // 👈 ESTO ES LO QUE TE FALTA
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
