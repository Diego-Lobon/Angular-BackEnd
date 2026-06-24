import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tipo_de_cambio') // Nombre exacto de tu tabla
export class TipoCambio {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 3, name: 'dolar' })
  dolar: number;
}
