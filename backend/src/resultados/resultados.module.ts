import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Partido } from '../partidos/partido.entity.js';
import { Resultado } from './resultado.entity.js';
import { ResultadosController } from './resultados.controller.js';
import { ResultadosService } from './resultados.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Partido, Resultado])],
  controllers: [ResultadosController],
  providers: [ResultadosService],
  exports: [ResultadosService],
})
export class ResultadosModule {}
