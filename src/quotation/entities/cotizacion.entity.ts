import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
// Asegúrate de que esta entidad apunte a la tabla 'clientes' de tu MySQL
import { Authcliente } from 'src/authclientes/entities/authcliente.entity';

@Entity({ name: 'cotizaciones' }) // Nombre exacto de la tabla en MySQL
export class Cotizacion {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Authcliente, { nullable: true })
  @JoinColumn({ name: 'id_cliente' }) // Mapea con la columna de la FK
  cliente?: Authcliente;

  @Column({ type: 'varchar', length: 50, nullable: true })
  numero_cotizacion?: string | null;

  @Column({ type: 'enum', enum: ['RUC', 'DNI'] })
  tipo_documento!: 'RUC' | 'DNI';

  @Column({ type: 'varchar', length: 25 })
  numero_documento!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  razon_social?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  solicitante?: string | null; // Añade | null

  @Column({
    type: 'enum',
    enum: ['PROCESO', 'ACEPTADO', 'RECHAZADO'],
    default: 'PROCESO',
  })
  estado!: 'PROCESO' | 'ACEPTADO' | 'RECHAZADO';

  @Column({ type: 'varchar', length: 512, nullable: true })
  pdf_url?: string | null; // Añade | null

  @CreateDateColumn({ type: 'timestamp' })
  fecha_creacion!: Date;
}
