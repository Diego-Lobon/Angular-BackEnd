import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'cart_items' }) // Esto definirá el nombre de la tabla en tu base de datos MySQL
export class CartItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'user_id' })
  userId!: string; // Puede ser number si tus IDs de usuario en MySQL son numéricos

  @Column({ name: 'product_id' })
  productId!: string; // Puede ser number si tus IDs de producto son numéricos

  @Column({ type: 'int', default: 1 })
  quantity!: number;

  // Opcional: Columnas de auditoría para saber cuándo se añadió o modificó el producto
  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
