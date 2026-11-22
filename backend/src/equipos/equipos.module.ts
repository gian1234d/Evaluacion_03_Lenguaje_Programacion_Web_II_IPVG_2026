import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EquiposService } from './equipos.service.js';
import { EquiposController } from './equipos.controller.js';
import { Equipo } from './equipo.entity.js';
import { Usuario } from '../usuarios/entities/usuario.entity.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([Equipo, Usuario]), AuthModule],
  controllers: [EquiposController],
  providers: [EquiposService],
  exports: [EquiposService],
})
export class EquiposModule {}
