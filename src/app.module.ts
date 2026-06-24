import { Module } from '@nestjs/common';
import { QuotationModule } from './quotation/quotation.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { CategoryModule } from './category/category.module';
import { RedisModule } from './redis/redis.module';
import { CartModule } from './cart/cart.module';
import { MarcaModule } from './marca/marca.module';
import { ClientesModule } from './clientes/clientes.module';
import { AuthclientesModule } from './authclientes/authclientes.module';
import { TipoUsuarioModule } from './tipo-usuario/tipo-usuario.module';
import { TipoCambioModule } from './tipo-cambio/tipo-cambio.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config'; // 1. Importar

@Module({
  imports: [
    QuotationModule,
    AuthModule,

    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // Asegura que lea tu archivo .env
    }),

    // 2. Configura TypeORM usando forRootAsync para leer las variables
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
        logging: true,
      }),
    }),

    ProductsModule,

    CategoryModule,

    RedisModule,

    CartModule,

    MarcaModule,

    ClientesModule,

    AuthclientesModule,

    TipoUsuarioModule,

    TipoCambioModule,

    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'), // 💡 Apunta a la carpeta raíz de tus archivos
      serveRoot: '/uploads', // 💡 Define el prefijo de la URL pública
    }),
  ],
})
export class AppModule {}
