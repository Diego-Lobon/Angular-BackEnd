// src/auth/auth.controller.ts
import { Body, Controller, Post, Get } from '@nestjs/common'; // <-- Asegúrate de agregar Get aquí

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body.username, body.password);
  }

  // --- NUEVA RUTA AGREGADA ---
  // Responderá a: GET http://192.168.18.38:3000/auth/users
  @Get('users')
  getUsers() {
    return this.authService.findAll();
  }
}
