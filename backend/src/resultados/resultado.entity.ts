import { JoinColumn, ManyToOne as Relacion, type Relation } from 'typeorm';
import { Partido } from '../partidos/partido.entity.js';
import { Equipo } from '../equipos/equipo.entity.js';
import { Usuario } from '../usuarios/entities/usuario.entity.js';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('resultados')
export class Resultado {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1 })
  id: number;

  @Column({ type: 'int', unique: true })
  @ApiProperty({ example: 9 })
  partidoId: number;

  @Column({ type: 'int', unsigned: true })
  @ApiProperty({ example: 3 })
  puntajeLocal: number;

  @Column({ type: 'int', unsigned: true })
  @ApiProperty({ example: 1 })
  puntajeVisitante: number;

  @Column({ type: 'int', nullable: true })
  @ApiProperty({ example: 12, nullable: true })
  ganadorId: number | null;

  @Column({ type: 'int' })
  @ApiProperty({ example: 1 })
  registradoPorId: number;

  @CreateDateColumn()
  @ApiProperty({ type: String, format: 'date-time' })
  registradoEn: Date;
  @Relacion(() => Partido, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'partidoId' })
  partido: Relation<Partido>;
  @Relacion(() => Equipo, { onDelete: 'RESTRICT', nullable: true })
  @JoinColumn({ name: 'ganadorId' })
  ganador: Relation<Equipo> | null;
  @Relacion(() => Usuario, { onDelete: 'RESTRICT', nullable: false })
  @JoinColumn({ name: 'registradoPorId' })
  registradoPor: Relation<Usuario>;
}
