import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

import { Product } from '../../products/entities/product.entity';

@Entity('marcas')
export class Marca {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nombre!: string;

  @OneToMany(() => Product, (product) => product.marca)
  productos!: Product[];
}
