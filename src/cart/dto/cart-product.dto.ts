import { IsString, IsNumber } from 'class-validator';

export class CartProductDto {
  @IsString()
  productId!: string;

  @IsNumber()
  quantity!: number;
}
