import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegistroDto {
  @ApiProperty({ example: 'Benjamín Mardones' })
  @IsString()
  nombre: string;

  @ApiProperty({ example: 'benjapro' })
  @IsString()
  alias: string;

  @ApiProperty({ example: 'benjamin@virginiogomez.cl' })
  @IsEmail()
  correo: string;

  @ApiProperty({ example: '123456', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;
}