import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum EstadoPartido {
  PROGRAMADO = 'programado',
  EN_CURSO = 'en_curso',
  FINALIZADO = 'finalizado',
  CANCELADO = 'cancelado',
}

@Entity('partidos')
export class Partido {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', unsigned: true })
  torneoId: number;

  @Column({ type: 'int', unsigned: true })
  equipoLocalId: number;

  @Column({ type: 'int', unsigned: true })
  equipoVisitanteId: number;

  @Column({ type: 'datetime' })
  fechaProgramada: Date;

  @Column({
    type: 'enum',
    enum: EstadoPartido,
    default: EstadoPartido.PROGRAMADO,
  })
  estado: EstadoPartido;
}
