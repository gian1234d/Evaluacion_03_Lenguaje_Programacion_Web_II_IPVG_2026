import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreatePartidoDto } from './dto/create-partido.dto.js';
import { Partido } from './partido.entity.js';

@Injectable()
export class PartidosService {
  constructor(
    @InjectRepository(Partido)
    private readonly partidoRepository: Repository<Partido>,
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreatePartidoDto): Promise<Partido> {
    if (dto.equipoLocalId === dto.equipoVisitanteId) {
      throw new BadRequestException('Un equipo no puede enfrentarse a sí mismo');
    }

    const torneos = await this.dataSource.query<Array<{ id: number }>>(
      'SELECT id FROM torneos WHERE id = ?',
      [dto.torneoId],
    );
    if (torneos.length === 0) {
      throw new NotFoundException(`Torneo ${dto.torneoId} no encontrado`);
    }

    const inscripciones = await this.dataSource.query<
      Array<{ equipoId: number | string }>
    >(
      'SELECT equipoId FROM inscripciones WHERE torneoId = ? AND equipoId IN (?, ?)',
      [dto.torneoId, dto.equipoLocalId, dto.equipoVisitanteId],
    );
    const equiposInscritos = new Set(
      inscripciones.map(({ equipoId }) => Number(equipoId)),
    );
    if (
      !equiposInscritos.has(dto.equipoLocalId) ||
      !equiposInscritos.has(dto.equipoVisitanteId)
    ) {
      throw new BadRequestException(
        'Ambos equipos deben estar inscritos en el torneo',
      );
    }

    const partido = this.partidoRepository.create(dto);
    return this.partidoRepository.save(partido);
  }

  findAll(): Promise<Partido[]> {
    return this.partidoRepository.find({
      order: { fechaProgramada: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Partido> {
    const partido = await this.partidoRepository.findOne({ where: { id } });
    if (!partido) {
      throw new NotFoundException(`Partido ${id} no encontrado`);
    }
    return partido;
  }
}
