// users/entities/auth.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('tipo_usuario')
export class TipoUsuario {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 50 })
  nombre!: string;
}

@Entity('usuarios')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  username!: string;

  @Column({ length: 100 })
  password!: string;

  @Column({ length: 100, nullable: true })
  correo?: string; // nullable: true porque en tu SQL es NULL

  @Column({ length: 100, nullable: true })
  celular?: string;

  // Relación con tipo_usuario
  @ManyToOne(() => TipoUsuario, { onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'tipo_id' }) // Mapea exactamente la columna de tu base de datos
  tipoUsuario!: TipoUsuario;
}
