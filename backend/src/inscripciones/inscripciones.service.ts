import { Equipo } from '../equipos/equipo.entity.js';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { EstadoTorneo, Torneo } from '../torneos/torneo.entity.js';
import { CreateInscripcionDto } from './dto/create-inscripcion.dto.js';
import { Inscripcion } from './inscripcion.entity.js';

@Injectable()
export class InscripcionesService {
  constructor(
    @InjectRepository(Inscripcion)
    private readonly inscripcionRepository: Repository<Inscripcion>,
    @InjectRepository(Torneo)
    private readonly torneoRepository: Repository<Torneo>,
    private readonly dataSource: DataSource,
  ) {}

  create(
    dto: CreateInscripcionDto,
    usuario: { sub: number; rol: string },
  ): Promise<Inscripcion> {
    return this.dataSource.transaction(async (manager) => {
      const torneos = manager.getRepository(Torneo);
      const inscripcionesRepo = manager.getRepository(Inscripcion);
      const torneo = await torneos.findOne({
        where: { id: dto.torneoId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!torneo)
        throw new NotFoundException(`Torneo ${dto.torneoId} no encontrado`);

      if (torneo.estado !== EstadoTorneo.ABIERTO) {
        throw new BadRequestException('El torneo no admite inscripciones');
      }
      if (torneo.cierreInscripcion.getTime() <= Date.now()) {
        throw new BadRequestException('El período de inscripción ya terminó');
      }

      const equipo = await manager.findOneBy(Equipo, { id: dto.equipoId });
      if (!equipo || equipo.estado !== 'activo') {
        throw new NotFoundException('Equipo activo no encontrado');
      }
      if (equipo.capitanId !== usuario.sub && usuario.rol !== 'admin') {
        throw new ForbiddenException(
          'Solo el capitán puede inscribir a su equipo',
        );
      }

      const inscrita = await inscripcionesRepo.findOne({
        where: { torneo: { id: dto.torneoId }, equipoId: dto.equipoId },
      });
      if (inscrita) {
        throw new ConflictException(
          'El equipo ya se encuentra inscrito en este torneo',
        );
      }

      const inscripciones = await inscripcionesRepo.count({
        where: { torneo: { id: dto.torneoId } },
      });
      if (inscripciones >= torneo.cupoMaximo) {
        throw new ConflictException('El torneo ya alcanzó su cupo máximo');
      }

      const inscripcion = inscripcionesRepo.create({
        torneo,
        equipoId: dto.equipoId,
      });
      return inscripcionesRepo.save(inscripcion);
    });
  }

  async findByTorneo(torneoId: number): Promise<Inscripcion[]> {
    if (!(await this.torneoRepository.existsBy({ id: torneoId }))) {
      throw new NotFoundException(`Torneo ${torneoId} no encontrado`);
    }
    return this.inscripcionRepository.find({
      where: { torneo: { id: torneoId } },
      order: { creadaEn: 'ASC' },
    });
  }

  remove(id: number): Promise<void> {
    return this.dataSource.transaction(async (manager) => {
      const inscripciones = manager.getRepository(Inscripcion);
      const inscripcion = await inscripciones.findOneBy({ id });
      if (!inscripcion)
        throw new NotFoundException(`Inscripción ${id} no encontrada`);
      await manager.findOne(Torneo, {
        where: { id: inscripcion.torneoId },
        lock: { mode: 'pessimistic_write' },
      });
      const partidos = await manager.query<{ id: number }[]>(
        'SELECT id FROM partidos WHERE torneoId = ? AND (equipoLocalId = ? OR equipoVisitanteId = ?) LIMIT 1 FOR UPDATE',
        [inscripcion.torneoId, inscripcion.equipoId, inscripcion.equipoId],
      );
      if (partidos.length)
        throw new ConflictException('El equipo tiene partidos en este torneo');
      const resultado = await inscripciones.delete(id);
      if (!resultado.affected)
        throw new NotFoundException(`Inscripción ${id} no encontrada`);
    });
  }
}
