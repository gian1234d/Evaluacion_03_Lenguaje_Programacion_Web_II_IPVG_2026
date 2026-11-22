import { UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '../torneos/admin.guard.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  HttpCode,
  ValidationPipe,
} from '@nestjs/common';
import { CreateInscripcionDto } from './dto/create-inscripcion.dto.js';
import { InscripcionesService } from './inscripciones.service.js';

@ApiTags('Inscripciones')
@Controller('inscripciones')
export class InscripcionesController {
  constructor(private readonly inscripcionesService: InscripcionesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  create(
    @Body(new ValidationPipe({ transform: true }))
    dto: CreateInscripcionDto,
    @Req() request: { user: { sub: number; rol: string } },
  ) {
    return this.inscripcionesService.create(dto, request.user);
  }

  @Get('torneo/:torneoId')
  findByTorneo(@Param('torneoId', ParseIntPipe) torneoId: number) {
    return this.inscripcionesService.findByTorneo(torneoId);
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.inscripcionesService.remove(id);
  }
}
