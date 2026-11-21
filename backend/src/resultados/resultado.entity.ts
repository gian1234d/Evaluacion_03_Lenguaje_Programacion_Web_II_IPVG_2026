import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('resultados')
export class Resultado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', unsigned: true, unique: true })
  partidoId: number;

  @Column({ type: 'int', unsigned: true })
  puntajeLocal: number;

  @Column({ type: 'int', unsigned: true })
  puntajeVisitante: number;

  @Column({ type: 'int', unsigned: true, nullable: true })
  ganadorId: number | null;

  @Column({ length: 120 })
  registradoPorId: string;

  @CreateDateColumn()
  registradoEn: Date;
}
