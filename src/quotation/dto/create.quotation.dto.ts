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

  // NUEVO
  @IsOptional()
  @IsString()
  username!: string;

  // NUEVO
  @IsOptional()
  @IsNumber()
  id_precio_lista!: number;
}
