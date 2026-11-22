import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

export class CreateInscripcionDto {
  @ApiProperty()
  @IsInt()
  @IsPositive()
  torneoId: number;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  equipoId: number;
}
