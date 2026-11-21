import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { EstadoTorneo } from '../torneo.entity.js';

export class TorneoFiltrosDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  q?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  juego?: string;

  @IsOptional()
  @IsEnum(EstadoTorneo)
  estado?: EstadoTorneo;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  modalidad?: string;
}
