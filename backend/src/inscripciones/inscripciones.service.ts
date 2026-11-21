import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
  ) {}

  async create(dto: CreateInscripcionDto): Promise<Inscripcion> {
    const torneo = await this.torneoRepository.findOne({
      where: { id: dto.torneoId },
    });
    if (!torneo) throw new NotFoundException(`Torneo ${dto.torneoId} no encontrado`);

    if (
      torneo.estado === EstadoTorneo.CANCELADO ||
      torneo.estado === EstadoTorneo.FINALIZADO
    ) {
      throw new BadRequestException('El torneo no admite inscripciones');
    }
    if (torneo.cierreInscripcion.getTime() <= Date.now()) {
      throw new BadRequestException('El período de inscripción ya terminó');
    }

    const inscrita = await this.inscripcionRepository.findOne({
      where: { torneo: { id: dto.torneoId }, equipoId: dto.equipoId },
    });
    if (inscrita) {
      throw new ConflictException('El equipo ya se encuentra inscrito en este torneo');
    }

    const inscripciones = await this.inscripcionRepository.count({
      where: { torneo: { id: dto.torneoId } },
    });
    if (inscripciones >= torneo.cupoMaximo) {
      throw new ConflictException('El torneo ya alcanzó su cupo máximo');
    }

    const inscripcion = this.inscripcionRepository.create({
      torneo,
      equipoId: dto.equipoId,
    });
    return this.inscripcionRepository.save(inscripcion);
  }

  findByTorneo(torneoId: number): Promise<Inscripcion[]> {
    return this.inscripcionRepository.find({
      where: { torneo: { id: torneoId } },
      order: { creadaEn: 'ASC' },
    });
  }

  async remove(id: number): Promise<void> {
    const resultado = await this.inscripcionRepository.delete(id);
    if (!resultado.affected) {
      throw new NotFoundException(`Inscripción ${id} no encontrada`);
    }
  }
}
