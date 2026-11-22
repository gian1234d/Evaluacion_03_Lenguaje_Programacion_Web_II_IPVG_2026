import { IsInt, IsPositive, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateResultadoDto {
  @ApiProperty({ example: 9 })
  @IsInt()
  @IsPositive()
  partidoId: number;

  @ApiProperty({ example: 3, minimum: 0 })
  @IsInt()
  @Min(0)
  puntajeLocal: number;

  @ApiProperty({ example: 1, minimum: 0 })
  @IsInt()
  @Min(0)
  puntajeVisitante: number;
}
