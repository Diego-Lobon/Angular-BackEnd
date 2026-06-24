import { Module } from '@nestjs/common';
import { TipoUsuarioService } from './tipo-usuario.service';
import { TipoUsuarioController } from './tipo-usuario.controller';

@Module({
  controllers: [TipoUsuarioController],
  providers: [TipoUsuarioService],
})
export class TipoUsuarioModule {}
