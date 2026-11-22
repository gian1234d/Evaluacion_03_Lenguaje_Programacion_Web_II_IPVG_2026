import { JoinColumn, ManyToOne as Relacion, type Relation } from 'typeorm';
import { Equipo } from '../equipos/equipo.entity.js';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { Torneo } from '../torneos/torneo.entity.js';

@Entity('inscripciones')
@Index(['torneo', 'equipoId'], { unique: true })
export class Inscripcion {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Torneo, (torneo) => torneo.inscripciones, {
    onDelete: 'CASCADE',
  })
  torneo: Relation<Torneo>;

  @RelationId((inscripcion: Inscripcion) => inscripcion.torneo)
  torneoId: number;

  @Column({ type: 'int' })
  equipoId: number;

  @Column({ type: 'varchar', length: 16, default: 'aceptada' })
  estado: 'aceptada';

  @CreateDateColumn()
  creadaEn: Date;
  @Relacion(() => Equipo, { onDelete: 'RESTRICT', nullable: false })
  @JoinColumn({ name: 'equipoId' })
  equipo: Relation<Equipo>;
}
