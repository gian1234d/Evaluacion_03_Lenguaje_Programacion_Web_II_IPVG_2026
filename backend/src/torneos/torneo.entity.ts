import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum EstadoTorneo {
  PROXIMO = 'proximo',
  ABIERTO = 'abierto',
  EN_CURSO = 'en_curso',
  FINALIZADO = 'finalizado',
  CANCELADO = 'cancelado',
}

@Entity('torneos')
export class Torneo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 120 })
  nombre: string;

  @Column({ length: 120 })
  videojuego: string;

  @Column({ length: 80 })
  modalidad: string;

  @Column({ type: 'datetime' })
  fechaInicio: Date;

  @Column({ type: 'datetime' })
  cierreInscripcion: Date;

  @Column({ type: 'int', unsigned: true })
  cupoMaximo: number;

  @Column({
    type: 'enum',
    enum: EstadoTorneo,
    default: EstadoTorneo.PROXIMO,
  })
  estado: EstadoTorneo;
}
