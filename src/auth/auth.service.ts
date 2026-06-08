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
    const user = await this.userRepository.findOne({
      where: {
        username,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no existe');
    }

    const isValid = await bcrypt.compare(
      password, // contraseña enviada desde Angular
      user.password, // hash guardado en MySQL
    );

    if (!isValid) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    const payload = {
      id: user.id,
      username: user.username,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      access_token: token,
    };
  }
}
