import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { CartItem } from './entities/cart.entity'; // Asegúrate de apuntar a tu entidad corregida

@Module({
  imports: [
    // 💡 ESTA ES LA LÍNEA QUE FALTA: Registra el repositorio en este módulo
    TypeOrmModule.forFeature([CartItem]),
  ],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService], // Por si necesitas usarlo en el módulo de autenticación luego
})
export class CartModule {}
