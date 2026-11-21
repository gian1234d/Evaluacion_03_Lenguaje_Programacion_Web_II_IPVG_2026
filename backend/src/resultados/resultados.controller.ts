import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import type { Request } from 'express';
import { AdminGuard } from './admin.guard.js';
import { CreateResultadoDto } from './dto/create-resultado.dto.js';
import { ResultadosService } from './resultados.service.js';

interface AdminRequest extends Request {
  user?: { id?: string | number; role?: string };
}

@Controller('resultados')
export class ResultadosController {
  constructor(private readonly resultadosService: ResultadosService) {}

  @Get()
  findAll() {
    return this.resultadosService.findAll();
  }

  @Post()
  @UseGuards(AdminGuard)
  create(
    @Body(new ValidationPipe({ transform: true }))
    dto: CreateResultadoDto,
    @Req() request: AdminRequest,
  ) {
    const adminId = request.user?.id;
    if (adminId === undefined) {
      throw new ForbiddenException(
        'El usuario administrador autenticado no tiene id',
      );
    }
    return this.resultadosService.create(dto, String(adminId));
  }
}
