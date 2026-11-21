import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { CreateInscripcionDto } from './dto/create-inscripcion.dto.js';
import { InscripcionesService } from './inscripciones.service.js';

@Controller('inscripciones')
export class InscripcionesController {
  constructor(private readonly inscripcionesService: InscripcionesService) {}

  @Post()
  create(
    @Body(new ValidationPipe({ transform: true }))
    dto: CreateInscripcionDto,
  ) {
    return this.inscripcionesService.create(dto);
  }

  @Get('torneo/:torneoId')
  findByTorneo(@Param('torneoId', ParseIntPipe) torneoId: number) {
    return this.inscripcionesService.findByTorneo(torneoId);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.inscripcionesService.remove(id);
  }
}
