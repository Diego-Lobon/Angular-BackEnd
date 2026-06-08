import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Category } from '../../products/entities/category.entity';

@Entity('productos')
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  id_migracion!: string;

  @Column()
  referencia_interna!: string;

  @Column()
  nombre!: string;

  @Column('decimal')
  costo!: number;

  @Column()
  marca!: string;

  @Column('decimal')
  precio_venta!: number;

  @Column()
  unidad_medida!: string;

  @Column()
  imagen_url!: string;

  @ManyToOne(() => Category)
  @JoinColumn({
    name: 'categoria_id',
  })
  categoria!: Category;
}
