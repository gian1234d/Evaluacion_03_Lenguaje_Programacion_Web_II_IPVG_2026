import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTorneoDto } from './dto/create-torneo.dto.js';
import { UpdateTorneoDto } from './dto/update-torneo.dto.js';
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

  findAll(): Promise<Torneo[]> {
    return this.torneoRepository.find({ order: { fechaInicio: 'ASC' } });
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
    if (!resultado.affected) throw new NotFoundException(`Torneo ${id} no encontrado`);
  }
}
