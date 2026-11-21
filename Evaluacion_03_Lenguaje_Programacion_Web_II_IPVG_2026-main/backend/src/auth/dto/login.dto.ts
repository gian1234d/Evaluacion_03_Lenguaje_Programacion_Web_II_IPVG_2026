import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'benjamin@virginiogomez.cl' })
  @IsEmail()
  correo: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  password: string;
}