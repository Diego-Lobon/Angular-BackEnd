import { IsString } from 'class-validator';

export class LoginDto {
  // * Verifica que username sea string.
  @IsString()
  username!: string;
  // * Verifica que password sea string.
  @IsString()
  password!: string;
}
