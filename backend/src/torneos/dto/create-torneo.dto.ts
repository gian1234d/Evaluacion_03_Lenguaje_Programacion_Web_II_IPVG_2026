import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  MaxLength,
} from 'class-validator';
import { EstadoTorneo } from '../torneo.entity.js';

export class CreateTorneoDto {
  @IsNotEmpty()
  @MaxLength(120)
  nombre: string;

  @IsNotEmpty()
  @MaxLength(120)
  videojuego: string;

  @IsNotEmpty()
  @MaxLength(80)
  modalidad: string;

  @Type(() => Date)
  @IsDate()
  fechaInicio: Date;

  @Type(() => Date)
  @IsDate()
  cierreInscripcion: Date;

  @IsInt()
  @IsPositive()
  cupoMaximo: number;

  @IsOptional()
  @IsEnum(EstadoTorneo)
  estado?: EstadoTorneo;
}
