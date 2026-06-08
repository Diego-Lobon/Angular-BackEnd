import { Module } from '@nestjs/common';
import { QuotationModule } from './quotation/quotation.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { CategoryModule } from './category/category.module';
import { RedisModule } from './redis/redis.module';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [
    QuotationModule,
    AuthModule,

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'isur_shop',

      autoLoadEntities: true,
      synchronize: false,
    }),

    ProductsModule,

    CategoryModule,

    RedisModule,

    CartModule,
  ],
})
export class AppModule {}
