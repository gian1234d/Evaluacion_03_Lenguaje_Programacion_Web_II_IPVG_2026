import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Partido } from '../partidos/partido.entity.js';
import { AdminGuard } from './admin.guard.js';
import { Resultado } from './resultado.entity.js';
import { ResultadosController } from './resultados.controller.js';
import { ResultadosService } from './resultados.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Partido, Resultado])],
  controllers: [ResultadosController],
  providers: [AdminGuard, ResultadosService],
  exports: [ResultadosService],
})
export class ResultadosModule {}
