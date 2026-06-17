import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  findAll() {
    return this.productRepository.find({
      relations: {
        categoria: true,
        marca: true,
      },
    });
  }

  findOne(id: number) {
    return this.productRepository.findOne({
      where: { id },
      relations: { categoria: true, marca: true },
    });
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const { categoriaId, marcaId, ...dataToUpdate } = updateProductDto;

    // Preparamos el objeto final mapeando los ID sueltos a la estructura que TypeORM necesita
    const productPayload: any = {
      id: Number(id),
      ...dataToUpdate,
    };

    if (categoriaId) {
      productPayload.categoria = { id: categoriaId };
    }
    if (marcaId) {
      productPayload.marca = { id: marcaId };
    }

    // Buscamos y fusionamos con preload
    const product = await this.productRepository.preload(productPayload);

    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    // Guardamos los cambios
    await this.productRepository.save(product);

    // Retornamos el registro refrescado con sus relaciones completas para que el Front lo renderice sin problemas
    return this.findOne(id);
  }
}
