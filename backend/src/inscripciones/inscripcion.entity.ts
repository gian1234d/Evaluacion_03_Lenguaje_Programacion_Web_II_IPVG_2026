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
  torneo: Torneo;

  @RelationId((inscripcion: Inscripcion) => inscripcion.torneo)
  torneoId: number;

  @Column({ type: 'int', unsigned: true })
  equipoId: number;

  @CreateDateColumn()
  creadaEn: Date;
}
