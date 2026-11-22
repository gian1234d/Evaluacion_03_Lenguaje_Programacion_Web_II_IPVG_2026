import {
  Controller,
  Get,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { RankingQueryDto } from './dto/ranking-query.dto.js';
import { RankingService } from './ranking.service.js';

@Controller('ranking')
export class RankingController {
  constructor(private readonly rankingService: RankingService) {}

  @Get()
  findByTorneo(
    @Query(new ValidationPipe({ transform: true }))
    query: RankingQueryDto,
  ) {
    return this.rankingService.findByTorneo(query.torneoId);
  }
}
