import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';

import { LoginDto } from './dto/login.dto';

// * Todas las rutas de este controlador
// * comenzarán con /auth
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  // * POST /auth/login
  @Post('login')
  login(@Body() body: LoginDto) {
    // * Llama al servicio y devuelve el resultado.
    return this.authService.login(body.username, body.password);
  }
}
