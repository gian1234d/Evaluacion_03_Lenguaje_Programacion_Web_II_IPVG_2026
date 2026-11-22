import { Type } from 'class-transformer';
import { IsDate, IsInt, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePartidoDto {
  @ApiProperty({ example: 3 })
  @IsInt()
  @IsPositive()
  torneoId: number;

  @ApiProperty({ example: 12 })
  @IsInt()
  @IsPositive()
  equipoLocalId: number;

  @ApiProperty({ example: 18 })
  @IsInt()
  @IsPositive()
  equipoVisitanteId: number;

  @ApiProperty({ type: String, format: 'date-time' })
  @Type(() => Date)
  @IsDate()
  fechaProgramada: Date;
}
