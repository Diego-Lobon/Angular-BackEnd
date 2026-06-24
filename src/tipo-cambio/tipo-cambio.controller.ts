import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { TipoCambioService } from './tipo-cambio.service';
import { CreateTipoCambioDto } from './dto/create-tipo-cambio.dto';
import { UpdateTipoCambioDto } from './dto/update-tipo-cambio.dto';

@Controller('tipo-cambio')
export class TipoCambioController {
  constructor(private readonly tipoCambioService: TipoCambioService) {}

  @Post()
  create(@Body() createTipoCambioDto: CreateTipoCambioDto) {
    // 1. Extraemos el valor que viene desde el body de Angular
    const valorDolar = Number(createTipoCambioDto.dolar);

    // 2. Ejecutamos la lógica de actualización/guardado en el ID: 1
    // Esto retornará la entidad guardada, ej: { id: 1, dolar: 3.386 } como JSON legítimo
    return this.tipoCambioService.guardarTipoCambio(valorDolar);
  }

  @Get()
  findAll() {
    return this.tipoCambioService.findAll();
  }

  // =========================================================
  // 1. RUTA ESTÁTICA PRIMERO: Para que no la confunda con un ID
  // =========================================================
  @Get('sunat')
  obtenerDesdeSunat() {
    return this.tipoCambioService.obtenerDesdeSunat();
  }

  // =========================================================
  // 2. RUTA DINÁMICA DESPUÉS
  // =========================================================
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tipoCambioService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTipoCambioDto: UpdateTipoCambioDto,
  ) {
    return this.tipoCambioService.update(id, updateTipoCambioDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tipoCambioService.remove(id);
  }
}
