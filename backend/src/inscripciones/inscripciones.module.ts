import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Torneo } from '../torneos/torneo.entity.js';
import { Inscripcion } from './inscripcion.entity.js';
import { InscripcionesController } from './inscripciones.controller.js';
import { InscripcionesService } from './inscripciones.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Inscripcion, Torneo])],
  controllers: [InscripcionesController],
  providers: [InscripcionesService],
  exports: [InscripcionesService],
})
export class InscripcionesModule {}
