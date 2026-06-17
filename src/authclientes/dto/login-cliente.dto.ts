import { IsNotEmpty, IsString } from 'class-validator';

export class LoginClienteDto {
  @IsString()
  @IsNotEmpty()
  username!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}
