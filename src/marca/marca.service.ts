import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Marca } from 'src/products/entities/marca.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MarcaService {
  constructor(
    @InjectRepository(Marca)
    private marcaRepository: Repository<Marca>,
  ) {}

  findAll() {
    return this.marcaRepository.find({
      order: {
        nombre: 'ASC',
      },
    });
  }
}
