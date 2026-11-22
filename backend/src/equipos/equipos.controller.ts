import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { ActualizarEquipoDto, CrearEquipoDto } from './dto/crear-equipo.dto.js';
import { EquiposService } from './equipos.service.js';

type UsuarioAutenticado = { user: { sub: number; rol: string } };

@ApiTags('Equipos')
@Controller('equipos')
export class EquiposController {
  constructor(private readonly equipos: EquiposService) {}

  @Get()
  findAll() {
    return this.equipos.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.equipos.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  crear(@Body() dto: CrearEquipoDto, @Req() { user }: UsuarioAutenticado) {
    return this.equipos.crear(dto, user.sub);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ActualizarEquipoDto,
    @Req() { user }: UsuarioAutenticado,
  ) {
    return this.equipos.actualizar(id, dto, user.sub, user.rol === 'admin');
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  eliminar(
    @Param('id', ParseIntPipe) id: number,
    @Req() { user }: UsuarioAutenticado,
  ) {
    return this.equipos.eliminar(id, user.sub, user.rol === 'admin');
  }
}
