import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { CreatePartidoDto } from './dto/create-partido.dto.js';
import { PartidosService } from './partidos.service.js';

@Controller('partidos')
export class PartidosController {
  constructor(private readonly partidosService: PartidosService) {}

  @Post()
  create(
    @Body(new ValidationPipe({ transform: true }))
    dto: CreatePartidoDto,
  ) {
    return this.partidosService.create(dto);
  }

  @Get()
  findAll() {
    return this.partidosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.partidosService.findOne(id);
  }
}
