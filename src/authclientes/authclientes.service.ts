import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { CreateAuthclienteDto } from './dto/create-authcliente.dto';
import { UpdateAuthclienteDto } from './dto/update-authcliente.dto';
import { LoginClienteDto } from './dto/login-cliente.dto';
import { Authcliente } from './entities/authcliente.entity';

@Injectable()
export class AuthclientesService {
  constructor(
    @InjectRepository(Authcliente)
    private readonly clienteRepository: Repository<Authcliente>,
    private readonly jwtService: JwtService, // <-- Inyectamos el servicio compartido
  ) {}

  // ======================================
  // INICIO DE SESIÓN DE CLIENTES (JWT)
  // ======================================
  // ======================================
  // INICIO DE SESIÓN DE CLIENTES (JWT)
  // ======================================
  async login(loginDto: LoginClienteDto) {
    const { username, password } = loginDto;

    // Buscar al cliente en la tabla 'clientes'
    const cliente = await this.clienteRepository.findOne({
      where: { username },
    });

    if (!cliente) {
      throw new UnauthorizedException('El cliente no existe');
    }

    // Comparar los hashes con bcrypt
    const isValid = await bcrypt.compare(password, cliente.password);
    if (!isValid) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    // 💡 CAMBIO AQUÍ: El payload del JWT DEBE incluir el id_precio_lista
    const payload = {
      id: cliente.id,
      username: cliente.username,
      tipo: 'cliente',
      id_precio_lista: cliente.id_precio_lista ?? null, // 👈 ¡AHORA SÍ VIAJA EN EL TOKEN!
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      access_token: token,
      cliente: {
        id: cliente.id,
        nombre: cliente.nombre,
        correo: cliente.correo,
        celular: cliente.celular,
        id_precio_lista: cliente.id_precio_lista,
      },
    };
  }

  // ======================================
  // CREACIÓN DE CLIENTES CON PASSWORD HASH
  // ======================================
  async create(createAuthclienteDto: any) {
    const { username, password, nombre, correo, celular, id_precio_lista } =
      createAuthclienteDto;

    // Verificar duplicados
    const existe = await this.clienteRepository.findOne({
      where: { username },
    });
    if (existe) {
      throw new ConflictException('El nombre de usuario ya está registrado');
    }

    // Encriptar contraseña antes de persistir en MySQL
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const nuevoCliente = this.clienteRepository.create({
      nombre,
      username,
      password: hashedPassword,
      correo,
      celular,
      id_precio_lista: id_precio_lista || null,
    });

    return this.clienteRepository.save(nuevoCliente);
  }

  findAll() {
    return this.clienteRepository.find();
  }

  findOne(id: number) {
    return this.clienteRepository.findOne({ where: { id } });
  }

  async update(id: number, updateAuthclienteDto: UpdateAuthclienteDto) {
    await this.clienteRepository.update(id, updateAuthclienteDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.clienteRepository.delete(id);
    return { message: 'Cliente eliminado del sistema de autenticación' };
  }
}
