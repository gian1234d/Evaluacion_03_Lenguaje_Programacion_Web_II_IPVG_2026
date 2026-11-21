import { IsInt, IsPositive } from 'class-validator';

export class CreateInscripcionDto {
  @IsInt()
  @IsPositive()
  torneoId: number;

  @IsInt()
  @IsPositive()
  equipoId: number;
}
