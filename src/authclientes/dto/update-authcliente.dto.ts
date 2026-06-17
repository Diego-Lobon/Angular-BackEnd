import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthclienteDto } from './create-authcliente.dto';

export class UpdateAuthclienteDto extends PartialType(CreateAuthclienteDto) {}
