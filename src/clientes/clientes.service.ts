import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from './entities/cliente.entity';

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
}
