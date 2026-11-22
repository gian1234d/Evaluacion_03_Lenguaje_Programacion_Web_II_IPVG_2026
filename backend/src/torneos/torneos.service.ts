import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CreateTorneoDto } from './dto/create-torneo.dto.js';
import { UpdateTorneoDto } from './dto/update-torneo.dto.js';
import { TorneoFiltrosDto } from './dto/torneo-filtros.dto.js';
import { Torneo } from './torneo.entity.js';

@Injectable()
export class TorneosService {
  constructor(
    @InjectRepository(Torneo)
    private readonly torneoRepository: Repository<Torneo>,
  ) {}

  create(dto: CreateTorneoDto): Promise<Torneo> {
    const torneo = this.torneoRepository.create(dto);
    return this.torneoRepository.save(torneo);
  }

  findAll(filtros: TorneoFiltrosDto = {}): Promise<Torneo[]> {
    const where: Record<string, unknown> = {};
    if (filtros.juego) where.videojuego = ILike(`%${filtros.juego}%`);
    if (filtros.estado) where.estado = filtros.estado;
    if (filtros.modalidad) where.modalidad = ILike(`%${filtros.modalidad}%`);

    if (filtros.q) {
      return this.torneoRepository
        .createQueryBuilder('torneo')
        .where(
          '(torneo.nombre LIKE :q OR torneo.videojuego LIKE :q OR torneo.modalidad LIKE :q)',
          { q: `%${filtros.q}%` },
        )
        .andWhere(filtros.juego ? 'torneo.videojuego LIKE :juego' : '1=1', {
          juego: `%${filtros.juego}%`,
        })
        .andWhere(filtros.estado ? 'torneo.estado = :estado' : '1=1', {
          estado: filtros.estado,
        })
        .andWhere(
          filtros.modalidad ? 'torneo.modalidad LIKE :modalidad' : '1=1',
          { modalidad: `%${filtros.modalidad}%` },
        )
        .orderBy('torneo.fechaInicio', 'ASC')
        .getMany();
    }

    return this.torneoRepository.find({
      where,
      order: { fechaInicio: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Torneo> {
    const torneo = await this.torneoRepository.findOne({ where: { id } });
    if (!torneo) throw new NotFoundException(`Torneo ${id} no encontrado`);
    return torneo;
  }

  async update(id: number, dto: UpdateTorneoDto): Promise<Torneo> {
    const torneo = await this.findOne(id);
    Object.assign(torneo, dto);
    return this.torneoRepository.save(torneo);
  }

  async remove(id: number): Promise<void> {
    const resultado = await this.torneoRepository.delete(id);
    if (!resultado.affected)
      throw new NotFoundException(`Torneo ${id} no encontrado`);
  }
}
