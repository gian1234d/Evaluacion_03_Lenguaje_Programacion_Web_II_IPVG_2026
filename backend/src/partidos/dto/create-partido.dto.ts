import { Type } from 'class-transformer';
import { IsDate, IsInt, IsPositive } from 'class-validator';

export class CreatePartidoDto {
  @IsInt()
  @IsPositive()
  torneoId: number;

  @IsInt()
  @IsPositive()
  equipoLocalId: number;

  @IsInt()
  @IsPositive()
  equipoVisitanteId: number;

  @Type(() => Date)
  @IsDate()
  fechaProgramada: Date;
}
