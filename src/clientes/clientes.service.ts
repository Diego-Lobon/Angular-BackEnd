import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from './entities/cliente.entity';
import * as bcrypt from 'bcrypt'; // 1. Importar bcrypt

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private clienteRepository: Repository<Cliente>,
  ) {}

  findAll() {
    return this.clienteRepository.find();
  }

  findOne(id: number) {
    return this.clienteRepository.findOne({
      where: { id },
    });
  }

  async updatePriceList(id: number, idPrecioLista: number | null) {
    const cliente = await this.findOne(id);
    if (!cliente) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }

    // Actualizamos el campo que mapea a la columna de MySQL
    cliente.id_precio_lista = idPrecioLista;
    return this.clienteRepository.save(cliente);
  }

  async remove(id: number) {
    await this.clienteRepository.delete(id);
    return {
      message: 'Cliente eliminado',
    };
  }

  async update(id: number, updateClienteDto: Partial<Cliente>) {
    const cliente = await this.findOne(id);
    if (!cliente) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }

    // 1. Filtrar: Solo si password tiene contenido real y no es solo espacios
    if (
      updateClienteDto.password &&
      updateClienteDto.password.trim().length > 0
    ) {
      const saltRounds = 12;
      updateClienteDto.password = await bcrypt.hash(
        updateClienteDto.password,
        saltRounds,
      );
    } else {
      // 2. Si es nulo o vacío, eliminamos la propiedad del DTO
      // para que Object.assign NO la sobrescriba en la entidad
      delete updateClienteDto.password;
    }

    // 3. Fusionamos solo las propiedades que quedaron en el DTO
    Object.assign(cliente, updateClienteDto);
    return this.clienteRepository.save(cliente);
  }
}
