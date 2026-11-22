import { ActualizarPerfilDto } from './dto/actualizar-perfil.dto.js';
import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsuariosService } from './usuarios.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@ApiTags('Usuarios')
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get('perfil')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener datos del usuario autenticado' })
  getPerfil(@Req() req: { user: { sub: number } }) {
    return this.usuariosService.findById(req.user.sub);
  }

  @Patch('perfil')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  actualizarPerfil(
    @Req() req: { user: { sub: number } },
    @Body() dto: ActualizarPerfilDto,
  ) {
    return this.usuariosService.actualizar(req.user.sub, dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar usuarios activos' })
  findAll() {
    return this.usuariosService.findAll();
  }
}
