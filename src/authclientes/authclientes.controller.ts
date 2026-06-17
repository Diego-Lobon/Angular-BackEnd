import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthclientesService } from './authclientes.service';
import { CreateAuthclienteDto } from './dto/create-authcliente.dto';
import { UpdateAuthclienteDto } from './dto/update-authcliente.dto';
import { LoginClienteDto } from './dto/login-cliente.dto'; // <-- Importar el nuevo DTO

@Controller('authclientes')
export class AuthclientesController {
  constructor(private readonly authclientesService: AuthclientesService) {}

  // POST /authclientes/login
  @Post('login')
  login(@Body() loginDto: LoginClienteDto) {
    return this.authclientesService.login(loginDto);
  }

  // POST /authclientes (Registro de nuevos clientes)
  @Post()
  create(@Body() createAuthclienteDto: CreateAuthclienteDto) {
    return this.authclientesService.create(createAuthclienteDto);
  }

  @Get()
  findAll() {
    return this.authclientesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authclientesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAuthclienteDto: UpdateAuthclienteDto,
  ) {
    return this.authclientesService.update(+id, updateAuthclienteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authclientesService.remove(+id);
  }
}
