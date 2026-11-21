import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Partido } from './partido.entity.js';
import { PartidosController } from './partidos.controller.js';
import { PartidosService } from './partidos.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Partido])],
  controllers: [PartidosController],
  providers: [PartidosService],
  exports: [PartidosService],
})
export class PartidosModule {}
