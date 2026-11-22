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
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AdminGuard } from './admin.guard.js';
import { CreateResultadoDto } from './dto/create-resultado.dto.js';
import { Resultado } from './resultado.entity.js';
import { ResultadosService } from './resultados.service.js';

interface AdminRequest extends Request {
  user?: { id?: string | number; role?: string };
}

@Controller('resultados')
@ApiTags('resultados')
export class ResultadosController {
  constructor(private readonly resultadosService: ResultadosService) {}

  @Get()
  @ApiOperation({ summary: 'Listar resultados oficiales' })
  @ApiOkResponse({ type: Resultado, isArray: true })
  findAll() {
    return this.resultadosService.findAll();
  }

  @Post()
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Registrar un resultado oficial como administrador' })
  @ApiCreatedResponse({ type: Resultado })
  @ApiForbiddenResponse({ description: 'Se requieren permisos de administrador' })
  @ApiConflictResponse({ description: 'El partido ya tiene resultado oficial' })
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
