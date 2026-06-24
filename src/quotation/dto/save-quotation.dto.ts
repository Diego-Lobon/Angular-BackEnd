// src/quotation/dto/save-quotation.dto.ts
import {
  IsOptional,
  IsNumber,
  IsString,
  IsEnum,
  IsArray,
  IsEmail,
} from 'class-validator';
import { ProductDto } from './create.quotation.dto';

export class SaveQuotationDto {
  @IsOptional()
  @IsNumber()
  id_cliente?: number;

  @IsOptional()
  @IsNumber()
  id_precio_lista?: number;

  @IsEnum(['RUC', 'DNI'])
  tipo_documento!: 'RUC' | 'DNI';

  @IsString()
  numero_documento!: string;

  @IsString()
  razon_social!: string;

  // 💡 AGREGAR ESTOS DOS ATRIBUTOS:
  @IsOptional()
  @IsString()
  direccion?: string;

  @IsOptional()
  @IsEmail() // O @IsString() si prefieres validación simple
  email?: string;

  @IsOptional()
  @IsString()
  solicitante?: string;

  @IsArray()
  products!: ProductDto[];
}
