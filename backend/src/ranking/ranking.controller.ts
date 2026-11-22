import {
  Controller,
  Get,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiProperty,
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { RankingQueryDto } from './dto/ranking-query.dto.js';
import { RankingService } from './ranking.service.js';
import type { PosicionRanking } from './ranking.service.js';

class PosicionRankingResponse implements PosicionRanking {
  @ApiProperty({ example: 3 })
  torneoId: number;

  @ApiProperty({ example: 12 })
  equipoId: number;

  @ApiProperty({ example: 4 })
  partidosJugados: number;

  @ApiProperty({ example: 3 })
  victorias: number;

  @ApiProperty({ example: 1 })
  empates: number;

  @ApiProperty({ example: 0 })
  derrotas: number;

  @ApiProperty({ example: 10 })
  puntos: number;

  @ApiProperty({ example: 14 })
  puntosAFavor: number;

  @ApiProperty({ example: 6 })
  puntosEnContra: number;
}

@Controller('ranking')
@ApiTags('ranking')
export class RankingController {
  constructor(private readonly rankingService: RankingService) {}

  @Get()
  @ApiOperation({ summary: 'Calcular el ranking de un torneo' })
  @ApiQuery({ name: 'torneoId', type: Number, required: true })
  @ApiOkResponse({ type: PosicionRankingResponse, isArray: true })
  @ApiBadRequestResponse({ description: 'El id del torneo debe ser positivo' })
  findByTorneo(
    @Query(new ValidationPipe({ transform: true }))
    query: RankingQueryDto,
  ) {
    return this.rankingService.findByTorneo(query.torneoId);
  }
}
