import { JoinColumn, ManyToOne as Relacion, type Relation } from 'typeorm';
import { Torneo } from '../torneos/torneo.entity.js';
import { Equipo } from '../equipos/equipo.entity.js';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum EstadoPartido {
  PROGRAMADO = 'programado',
  EN_CURSO = 'en_curso',
  FINALIZADO = 'finalizado',
  CANCELADO = 'cancelado',
}

@Entity('partidos')
export class Partido {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1 })
  id: number;

  @Column({ type: 'int' })
  @ApiProperty({ example: 3 })
  torneoId: number;

  @Column({ type: 'int' })
  @ApiProperty({ example: 12 })
  equipoLocalId: number;

  @Column({ type: 'int' })
  @ApiProperty({ example: 18 })
  equipoVisitanteId: number;

  @Column({ length: 80, default: 'General' })
  @ApiProperty({ example: 'Semifinal' })
  ronda: string;

  @Column({ type: 'datetime' })
  @ApiProperty({ type: String, format: 'date-time' })
  fechaProgramada: Date;

  @Column({
    type: 'enum',
    enum: EstadoPartido,
    default: EstadoPartido.PROGRAMADO,
  })
  @ApiProperty({ enum: EstadoPartido, example: EstadoPartido.PROGRAMADO })
  estado: EstadoPartido;
  @Relacion(() => Torneo, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'torneoId' })
  torneo: Relation<Torneo>;
  @Relacion(() => Equipo, { onDelete: 'RESTRICT', nullable: false })
  @JoinColumn({ name: 'equipoLocalId' })
  equipoLocal: Relation<Equipo>;
  @Relacion(() => Equipo, { onDelete: 'RESTRICT', nullable: false })
  @JoinColumn({ name: 'equipoVisitanteId' })
  equipoVisitante: Relation<Equipo>;
}
