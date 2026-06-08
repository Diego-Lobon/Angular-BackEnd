import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

import { Product } from '../../products/entities/product.entity';

@Entity('categorias')
export class Category {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nombre!: string;

  @OneToMany(() => Product, (product) => product.categoria)
  productos!: Product[];
}
