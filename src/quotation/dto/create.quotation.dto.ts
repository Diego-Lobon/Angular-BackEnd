import { IsArray, IsNumber, IsString, IsOptional } from 'class-validator';

export class ProductDto {
  @IsString()
  referencia_interna!: string;

  @IsString()
  nombre!: string;

  @IsNumber()
  precio_venta!: number;

  @IsNumber()
  cantidad!: number;
}

export class CreateQuotationDto {
  @IsArray()
  products!: ProductDto[];

  @IsString()
  moneda!: string;

  @IsOptional()
  @IsString()
  username!: string;

  @IsOptional()
  @IsNumber()
  id_precio_lista!: number;

  // 💡 NUEVOS ATRIBUTOS DEL FORMULARIO
  @IsOptional()
  @IsString()
  tipo_documento?: string;

  @IsOptional()
  @IsString()
  numero_documento?: string;

  @IsOptional()
  @IsString()
  direccion?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  solicitante?: string;
}
