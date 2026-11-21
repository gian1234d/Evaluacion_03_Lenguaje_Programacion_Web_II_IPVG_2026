import { IsInt, IsPositive, Min } from 'class-validator';

export class CreateResultadoDto {
  @IsInt()
  @IsPositive()
  partidoId: number;

  @IsInt()
  @Min(0)
  puntajeLocal: number;

  @IsInt()
  @Min(0)
  puntajeVisitante: number;
}
