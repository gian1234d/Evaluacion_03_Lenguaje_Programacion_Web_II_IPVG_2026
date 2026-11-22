import { UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AdminGuard } from '../torneos/admin.guard.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CreatePartidoDto } from './dto/create-partido.dto.js';
import { Partido } from './partido.entity.js';
import { PartidosService } from './partidos.service.js';

@Controller('partidos')
@ApiTags('partidos')
export class PartidosController {
  constructor(private readonly partidosService: PartidosService) {}

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Programar un partido' })
  @ApiCreatedResponse({ type: Partido })
  @ApiBadRequestResponse({ description: 'Equipos repetidos o no inscritos' })
  @ApiNotFoundResponse({ description: 'Torneo no encontrado' })
  create(
    @Body(new ValidationPipe({ transform: true }))
    dto: CreatePartidoDto,
  ) {
    return this.partidosService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar partidos programados' })
  @ApiOkResponse({ type: Partido, isArray: true })
  findAll() {
    return this.partidosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un partido por id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: Partido })
  @ApiNotFoundResponse({ description: 'Partido no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.partidosService.findOne(id);
  }
}
