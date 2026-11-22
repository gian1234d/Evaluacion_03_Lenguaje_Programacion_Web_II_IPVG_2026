import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Equipo } from './equipo.entity.js';
import { Usuario } from '../usuarios/entities/usuario.entity.js';
import { CrearEquipoDto } from './dto/crear-equipo.dto.js';

@Injectable()
export class EquiposService {
  constructor(
    @InjectRepository(Equipo)
    private readonly equiposRepo: Repository<Equipo>,
    @InjectRepository(Usuario)
    private readonly usuariosRepo: Repository<Usuario>,
  ) {}

  private limpiarContrasenas(equipo: Equipo): Equipo {
    if (equipo.capitan) {
      delete (equipo.capitan as Partial<Usuario>).password;
      delete (equipo.capitan as Partial<Usuario>).correo;
    }
    if (equipo.integrantes) {
      equipo.integrantes = equipo.integrantes.map((u) => {
        delete (u as Partial<Usuario>).password;
        delete (u as Partial<Usuario>).correo;
        return u;
      });
    }
    return equipo;
  }

  async crear(dto: CrearEquipoDto, capitanId: number): Promise<Equipo> {
    const existe = await this.equiposRepo.findOne({
      where: { nombre: dto.nombre },
    });
    if (existe) {
      throw new ConflictException(
        'Ya existe un equipo registrado con ese nombre',
      );
    }

    const capitan = await this.usuariosRepo.findOne({
      where: { id: capitanId, activo: true },
    });
    if (!capitan) {
      throw new NotFoundException('Capitán no encontrado o inactivo');
    }

    const miembrosMap = new Map<number, Usuario>();
    miembrosMap.set(capitan.id, capitan);

    if (dto.integrantesIds && dto.integrantesIds.length > 0) {
      const otrosMiembros = await this.usuariosRepo.findBy({
        id: In(dto.integrantesIds),
        activo: true,
      });
      otrosMiembros.forEach((m) => miembrosMap.set(m.id, m));
    }

    const nuevoEquipo = this.equiposRepo.create({
      nombre: dto.nombre.trim(),
      juegoPreferido: dto.juegoPreferido?.trim() || 'General',
      capitan,
      capitanId,
      integrantes: Array.from(miembrosMap.values()),
    });

    const guardado = await this.equiposRepo.save(nuevoEquipo);
    return this.limpiarContrasenas(guardado);
  }

  async findAll(): Promise<Equipo[]> {
    const equipos = await this.equiposRepo.find({
      order: { creadoEn: 'DESC' },
    });
    return equipos.map((e) => this.limpiarContrasenas(e));
  }

  async findOne(id: number): Promise<Equipo> {
    const equipo = await this.equiposRepo.findOne({ where: { id } });
    if (!equipo) {
      throw new NotFoundException(`Equipo #${id} no encontrado`);
    }
    return this.limpiarContrasenas(equipo);
  }

  async actualizar(
    id: number,
    dto: Partial<CrearEquipoDto>,
    usuarioId: number,
    esAdmin: boolean,
  ): Promise<Equipo> {
    const equipo = await this.findOne(id);

    if (equipo.capitanId !== usuarioId && !esAdmin) {
      throw new ForbiddenException(
        'Solo el capitán o un administrador pueden editar este equipo',
      );
    }

    if (dto.nombre && dto.nombre !== equipo.nombre) {
      const repetido = await this.equiposRepo.findOne({
        where: { nombre: dto.nombre },
      });
      if (repetido)
        throw new ConflictException('Ya existe un equipo con ese nombre');
      equipo.nombre = dto.nombre.trim();
    }

    if (dto.juegoPreferido !== undefined) {
      equipo.juegoPreferido = dto.juegoPreferido.trim();
    }

    if (dto.integrantesIds) {
      const miembros = await this.usuariosRepo.findBy({
        id: In(dto.integrantesIds),
        activo: true,
      });
      const capitan = await this.usuariosRepo.findOne({
        where: { id: equipo.capitanId },
      });
      const setMiembros = new Map<number, Usuario>();
      if (capitan) setMiembros.set(capitan.id, capitan);
      miembros.forEach((m) => setMiembros.set(m.id, m));
      equipo.integrantes = Array.from(setMiembros.values());
    }

    const guardado = await this.equiposRepo.save(equipo);
    return this.limpiarContrasenas(guardado);
  }

  async eliminar(
    id: number,
    usuarioId: number,
    esAdmin: boolean,
  ): Promise<{ message: string }> {
    const equipo = await this.findOne(id);

    if (equipo.capitanId !== usuarioId && !esAdmin) {
      throw new ForbiddenException(
        'Solo el capitán o un administrador pueden eliminar este equipo',
      );
    }

    try {
      await this.equiposRepo.remove(equipo);
    } catch (error) {
      if ((error as { code?: string }).code === 'ER_ROW_IS_REFERENCED_2') {
        throw new ConflictException(
          'El equipo tiene inscripciones o partidos asociados',
        );
      }
      throw error;
    }
    return { message: `Equipo "${equipo.nombre}" eliminado correctamente` };
  }
}
