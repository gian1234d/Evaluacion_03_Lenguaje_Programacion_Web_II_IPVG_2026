import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { EstadoPartido, Partido } from '../partidos/partido.entity.js';
import { CreateResultadoDto } from './dto/create-resultado.dto.js';
import { Resultado } from './resultado.entity.js';

@Injectable()
export class ResultadosService {
  constructor(
    @InjectRepository(Resultado)
    private readonly resultadoRepository: Repository<Resultado>,
    private readonly dataSource: DataSource,
  ) {}

  create(dto: CreateResultadoDto, adminId: number): Promise<Resultado> {
    return this.dataSource.transaction(async (manager) => {
      const partidoRepository = manager.getRepository(Partido);
      const resultadoRepository = manager.getRepository(Resultado);
      const partido = await partidoRepository.findOne({
        where: { id: dto.partidoId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!partido) {
        throw new NotFoundException(`Partido ${dto.partidoId} no encontrado`);
      }

      const existente = await resultadoRepository.findOne({
        where: { partidoId: dto.partidoId },
      });
      if (existente) {
        throw new ConflictException(
          `El partido ${dto.partidoId} ya tiene un resultado oficial`,
        );
      }

      const ganadorId =
        dto.puntajeLocal === dto.puntajeVisitante
          ? null
          : dto.puntajeLocal > dto.puntajeVisitante
            ? partido.equipoLocalId
            : partido.equipoVisitanteId;
      const resultado = resultadoRepository.create({
        partidoId: dto.partidoId,
        puntajeLocal: dto.puntajeLocal,
        puntajeVisitante: dto.puntajeVisitante,
        ganadorId,
        registradoPorId: adminId,
      });
      const guardado = await resultadoRepository.save(resultado);

      partido.estado = EstadoPartido.FINALIZADO;
      await partidoRepository.save(partido);

      return guardado;
    });
  }

  findAll(): Promise<Resultado[]> {
    return this.resultadoRepository.find({ order: { registradoEn: 'DESC' } });
  }
}
