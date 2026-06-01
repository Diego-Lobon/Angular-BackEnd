// Injectable permite que NestJS pueda inyectar esta clase
// en otras partes de la aplicación.
import { Injectable, UnauthorizedException } from '@nestjs/common';

// Servicio para crear y verificar tokens JWT.
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  // NestJS inyecta automáticamente JwtService
  // gracias a la inyección de dependencias.
  constructor(private jwtService: JwtService) {}

  // Método encargado de iniciar sesión.
  async login(username: string, password: string) {
    // USUARIO PRUEBA
    // Validación simple de usuario y contraseña.
    // Aquí normalmente consultarías una base de datos.
    if (username !== 'admin' || password !== '123456') {
      // Lanza un error HTTP 401 Unauthorized.
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // PAYLOAD JWT
    // Información que será almacenada dentro del JWT.
    // No es recomendable guardar contraseñas aquí.
    const payload = {
      username,
    };

    // TOKEN
    // Genera un token JWT firmado con la clave secreta.
    const token = await this.jwtService.signAsync(payload);

    // Devuelve el token al cliente.
    return {
      access_token: token,
    };
  }
}
