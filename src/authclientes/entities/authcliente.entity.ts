import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('clientes')
export class Authcliente {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  nombre!: string;

  @Column({ length: 100, unique: true })
  username!: string;

  @Column({ length: 150 })
  password!: string;

  @Column({ length: 50, nullable: true })
  correo!: string;

  @Column({ type: 'int', nullable: true })
  celular!: number;

  @Column({ type: 'int', nullable: true })
  id_precio_lista!: number | null;
}
