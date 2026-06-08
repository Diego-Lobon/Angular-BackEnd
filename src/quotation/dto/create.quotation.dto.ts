import { IsArray, IsNumber, IsString } from 'class-validator';

// * Representa un producto individual
export class ProductDto {
  // * Nombre del producto
  @IsString()
  referencia_interna!: string;

  // * Nombre del producto
  @IsString()
  nombre!: string;

  // * Precio unitario
  @IsNumber()
  precio_venta!: number;

  // * Cantidad
  @IsNumber()
  cantidad!: number;
}

// * Representa toda la cotización
export class CreateQuotationDto {
  // * Lista de productos
  @IsArray()
  products!: ProductDto[];
}
