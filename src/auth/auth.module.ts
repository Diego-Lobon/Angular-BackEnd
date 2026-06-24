import { Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { User, TipoUsuario } from './entities/auth.entity';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([User, TipoUsuario]), // <-- Agrega TipoUsuario aquí
    JwtModule.register({
      secret: 'SECRET_KEY',
      signOptions: {
        expiresIn: '1d',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [JwtModule],
})
export class AuthModule {}
