import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Usuario } from '../usuarios/entities/usuario.entity.js';

export enum EstadoEquipo {
  ACTIVO = 'activo',
  INACTIVO = 'inactivo',
}

@Entity('equipos')
export class Equipo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  nombre: string;

  @Column({ default: 'General' })
  juegoPreferido: string;

  @Column({ type: 'enum', enum: EstadoEquipo, default: EstadoEquipo.ACTIVO })
  estado: EstadoEquipo;

  @Column()
  capitanId: number;

  @ManyToOne(() => Usuario, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'capitanId' })
  capitan: Usuario;

  @ManyToMany(() => Usuario, { eager: true })
  @JoinTable({
    name: 'equipo_integrantes',
    joinColumn: { name: 'equipoId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'usuarioId', referencedColumnName: 'id' },
  })
  integrantes: Usuario[];

  @CreateDateColumn()
  creadoEn: Date;

  @UpdateDateColumn()
  actualizadoEn: Date;
}
