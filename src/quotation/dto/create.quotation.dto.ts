import { IsArray, IsNumber, IsString } from 'class-validator';

export class ProductDto {
  @IsString()
  name!: string;

  @IsNumber()
  price!: number;

  @IsNumber()
  cant!: number;
}

export class CreateQuotationDto {
  @IsArray()
  products!: ProductDto[];
}
