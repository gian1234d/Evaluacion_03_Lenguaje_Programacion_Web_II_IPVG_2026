import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

interface ResultadoPartidoRow {
  equipoId: number | string;
  ganadorId: number | string | null;
  puntajeEquipo: number | string;
  puntajeRival: number | string;
}

export interface PosicionRanking {
  torneoId: number;
  equipoId: number;
  partidosJugados: number;
  victorias: number;
  empates: number;
  derrotas: number;
  puntos: number;
  puntosAFavor: number;
  puntosEnContra: number;
}

@Injectable()
export class RankingService {
  constructor(private readonly dataSource: DataSource) {}

  async findByTorneo(torneoId: number): Promise<PosicionRanking[]> {
    const registros = await this.dataSource.query<ResultadoPartidoRow[]>(
      `SELECT p.equipoLocalId AS equipoId,
              r.ganadorId AS ganadorId,
              r.puntajeLocal AS puntajeEquipo,
              r.puntajeVisitante AS puntajeRival
         FROM resultados r
         INNER JOIN partidos p ON p.id = r.partidoId
        WHERE p.torneoId = ?
       UNION ALL
       SELECT p.equipoVisitanteId AS equipoId,
              r.ganadorId AS ganadorId,
              r.puntajeVisitante AS puntajeEquipo,
              r.puntajeLocal AS puntajeRival
         FROM resultados r
         INNER JOIN partidos p ON p.id = r.partidoId
        WHERE p.torneoId = ?`,
      [torneoId, torneoId],
    );

    const posiciones = new Map<number, PosicionRanking>();
    for (const registro of registros) {
      const equipoId = Number(registro.equipoId);
      const posicion = posiciones.get(equipoId) ?? {
        torneoId,
        equipoId,
        partidosJugados: 0,
        victorias: 0,
        empates: 0,
        derrotas: 0,
        puntos: 0,
        puntosAFavor: 0,
        puntosEnContra: 0,
      };
      const puntajeEquipo = Number(registro.puntajeEquipo);
      const puntajeRival = Number(registro.puntajeRival);
      const ganadorId =
        registro.ganadorId === null ? null : Number(registro.ganadorId);

      posicion.partidosJugados += 1;
      posicion.puntosAFavor += puntajeEquipo;
      posicion.puntosEnContra += puntajeRival;
      if (ganadorId === null) {
        posicion.empates += 1;
        posicion.puntos += 1;
      } else if (ganadorId === equipoId) {
        posicion.victorias += 1;
        posicion.puntos += 3;
      } else {
        posicion.derrotas += 1;
      }
      posiciones.set(equipoId, posicion);
    }

    return [...posiciones.values()].sort(
      (a, b) =>
        b.puntos - a.puntos ||
        b.victorias - a.victorias ||
        b.puntosAFavor -
          b.puntosEnContra -
          (a.puntosAFavor - a.puntosEnContra) ||
        a.equipoId - b.equipoId,
    );
  }
}
