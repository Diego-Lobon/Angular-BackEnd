import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Configuración unificada de CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    exposedHeaders: ['Content-Disposition', 'X-File-Name'],
  });

  app.useGlobalPipes(new ValidationPipe());

  // IMPORTANTE:
  // Si en tu AppModule ya tienes: ServeStaticModule.forRoot({ serveRoot: '/uploads', ... })
  // NO necesitas la línea app.use('/uploads', express.static(...)) aquí.
  // Déjalo solo en uno de los dos sitios para evitar conflictos.

  // Puerto 0.0.0.0 es obligatorio para Render
  const port = process.env.PORT ?? 3000;
  await app.listen(port, '0.0.0.0');
}
bootstrap();
