import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { TipoCambioService } from './tipo-cambio.service';
import { TipoCambioController } from './tipo-cambio.controller';
import { TipoCambio } from './entities/tipo-cambio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TipoCambio]), HttpModule],
  controllers: [TipoCambioController],
  providers: [TipoCambioService],
})
export class TipoCambioModule {}
