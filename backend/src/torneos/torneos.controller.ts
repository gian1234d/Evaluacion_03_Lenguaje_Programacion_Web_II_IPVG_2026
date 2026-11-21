import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AdminGuard } from './admin.guard.js';
import { CreateTorneoDto } from './dto/create-torneo.dto.js';
import { UpdateTorneoDto } from './dto/update-torneo.dto.js';
import { TorneosService } from './torneos.service.js';

@Controller('torneos')
export class TorneosController {
  constructor(private readonly torneosService: TorneosService) {}

  @Get()
  findAll() {
    return this.torneosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.torneosService.findOne(id);
  }

  @Post()
  @UseGuards(AdminGuard)
  create(@Body(new ValidationPipe({ transform: true })) dto: CreateTorneoDto) {
    return this.torneosService.create(dto);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ transform: true })) dto: UpdateTorneoDto,
  ) {
    return this.torneosService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.torneosService.remove(id);
  }
}
