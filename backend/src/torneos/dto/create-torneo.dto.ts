import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(120)
  nombre: string;

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(120)
  videojuego: string;

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(80)
  modalidad: string;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  fechaInicio: Date;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  cierreInscripcion: Date;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  cupoMaximo: number;

  @ApiPropertyOptional({ enum: EstadoTorneo })
  @IsOptional()
  @IsEnum(EstadoTorneo)
  estado?: EstadoTorneo;
}
