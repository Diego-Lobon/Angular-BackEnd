// * Importa el creador de aplicaciones NestJS
import { NestFactory } from '@nestjs/core';

// * Importa el módulo principal
import { AppModule } from './app.module';

// * Permite validar automáticamente los DTOs
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // * Crea la aplicación usando AppModule
  const app = await NestFactory.create(AppModule);

  // * Permite peticiones desde otros dominios
  // * Ejemplo: Angular en localhost:4200
  app.enableCors();

  // * Activa validaciones globales para todos los DTO
  app.useGlobalPipes(new ValidationPipe());

  // * Inicia el servidor
  await app.listen(process.env.PORT ?? 3000);
}
// * Ejecuta la aplicación
bootstrap();
