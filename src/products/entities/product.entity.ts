import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Category } from '../../products/entities/category.entity';
import { Marca } from '../../products/entities/marca.entity';

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
  costo_dolares!: number;

  @Column('decimal')
  costo_soles!: number;

  @Column('decimal')
  precio_venta_dolares!: number;

  @Column('decimal')
  precio_venta_soles!: number;

  @Column()
  unidad_medida!: string;

  @Column()
  imagen_url!: string;

  @ManyToOne(() => Category)
  @JoinColumn({
    name: 'categoria_id',
  })
  categoria!: Category;

  @ManyToOne(() => Marca)
  @JoinColumn({
    name: 'marca_id',
  })
  marca!: Marca;
}
