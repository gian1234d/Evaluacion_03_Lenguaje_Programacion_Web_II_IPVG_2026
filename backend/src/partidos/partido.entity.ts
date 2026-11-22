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

  @Column({ type: 'int', unsigned: true })
  @ApiProperty({ example: 3 })
  torneoId: number;

  @Column({ type: 'int', unsigned: true })
  @ApiProperty({ example: 12 })
  equipoLocalId: number;

  @Column({ type: 'int', unsigned: true })
  @ApiProperty({ example: 18 })
  equipoVisitanteId: number;

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
}
