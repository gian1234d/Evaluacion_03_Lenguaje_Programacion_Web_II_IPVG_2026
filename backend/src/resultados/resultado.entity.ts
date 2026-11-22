import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('resultados')
export class Resultado {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1 })
  id: number;

  @Column({ type: 'int', unsigned: true, unique: true })
  @ApiProperty({ example: 9 })
  partidoId: number;

  @Column({ type: 'int', unsigned: true })
  @ApiProperty({ example: 3 })
  puntajeLocal: number;

  @Column({ type: 'int', unsigned: true })
  @ApiProperty({ example: 1 })
  puntajeVisitante: number;

  @Column({ type: 'int', unsigned: true, nullable: true })
  @ApiProperty({ example: 12, nullable: true })
  ganadorId: number | null;

  @Column({ length: 120 })
  @ApiProperty({ example: 'admin-1' })
  registradoPorId: string;

  @CreateDateColumn()
  @ApiProperty({ type: String, format: 'date-time' })
  registradoEn: Date;
}
