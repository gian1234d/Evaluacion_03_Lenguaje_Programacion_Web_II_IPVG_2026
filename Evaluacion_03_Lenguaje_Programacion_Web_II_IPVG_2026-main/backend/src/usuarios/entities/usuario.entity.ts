import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum RolUsuario {
  ADMIN = 'admin',
  ESTUDIANTE = 'estudiante',
}

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ unique: true })
  alias: string;

  @Column({ unique: true })
  correo: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: RolUsuario, default: RolUsuario.ESTUDIANTE })
  rol: RolUsuario;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn()
  creadoEn: Date;
}