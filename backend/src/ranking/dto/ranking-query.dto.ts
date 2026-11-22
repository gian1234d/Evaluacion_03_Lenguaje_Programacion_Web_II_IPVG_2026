import { Type } from 'class-transformer';
import { IsInt, IsPositive } from 'class-validator';

export class RankingQueryDto {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  torneoId: number;
}
