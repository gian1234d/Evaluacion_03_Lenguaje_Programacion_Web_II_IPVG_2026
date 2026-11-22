import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';
import { RegistroDto } from '../../auth/dto/registro.dto.js';

export class ActualizarPerfilDto extends PickType(RegistroDto, ['correo']) {
  @ApiProperty()
  @IsString()
  @Length(2, 100)
  nombre: string;

  @ApiProperty()
  @IsString()
  @Length(2, 50)
  alias: string;
}
