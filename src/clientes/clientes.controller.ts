import { Controller, Get, Param, Delete, Patch, Body } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { Cliente } from './entities/cliente.entity';

@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  // LISTAR TODOS
  @Get()
  findAll() {
    return this.clientesService.findAll();
  }

  // OBTENER UNO
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientesService.findOne(Number(id));
  }

  // ACTUALIZAR ASIGNACIÓN DE LISTA DE PRECIOS
  @Patch(':id/lista-precios')
  updatePriceList(
    @Param('id') id: string,
    @Body('id_precio_lista') idPrecioLista: number | null,
  ) {
    return this.clientesService.updatePriceList(Number(id), idPrecioLista);
  }

  // ELIMINAR
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientesService.remove(Number(id));
  }

  // ACTUALIZAR TODOS LOS DATOS DEL CLIENTE
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClienteDto: Partial<Cliente>) {
    return this.clientesService.update(Number(id), updateClienteDto);
  }
}
