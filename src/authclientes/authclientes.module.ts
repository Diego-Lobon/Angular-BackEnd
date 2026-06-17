import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module'; // <-- Ajusta la ruta a tu AuthModule original
import { AuthclientesService } from './authclientes.service';
import { AuthclientesController } from './authclientes.controller';
import { Authcliente } from './entities/authcliente.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Authcliente]),
    AuthModule, // <-- Al importar esto, tenemos acceso directo al JwtService configurado
  ],
  controllers: [AuthclientesController],
  providers: [AuthclientesService],
})
export class AuthclientesModule {}
