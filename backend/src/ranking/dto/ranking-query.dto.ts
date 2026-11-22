import { Type } from 'class-transformer';
import { IsInt, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RankingQueryDto {
  @ApiProperty({ example: 3 })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  torneoId: number;
}
