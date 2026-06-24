import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/auth.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async login(username: string, password: string) {
    // Buscamos el usuario incluyendo la relación con su tipo
    const user = await this.userRepository.findOne({
      where: { username },
      relations: {
        tipoUsuario: true, // <-- CAMBIA EL ARREGLO DE STRINGS POR ESTE OBJETO
      },
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no existe');
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    // Configura el payload con los nuevos datos útiles para el Frontend (Angular)
    const payload = {
      id: user.id,
      username: user.username,
      correo: user.correo,
      celular: user.celular,
      tipo_usuario: user.tipoUsuario ? user.tipoUsuario.nombre : null, // Ejemplo: 'ADMINISTRADOR', 'VENDEDOR'
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      access_token: token,
    };
  }

  async findAll() {
    return await this.userRepository.find({
      relations: {
        tipoUsuario: true, // Hace el JOIN automático en la BD
      },
      select: {
        id: true,
        username: true,
        correo: true,
        celular: true,
        // Traemos solo los datos necesarios de la relación
        tipoUsuario: {
          id: true,
          nombre: true,
        },
      },
    });
  }
}
