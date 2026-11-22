import { beforeEach, describe, expect, it, vi } from 'vitest';
import { RankingService } from './ranking.service.js';

describe('RankingService', () => {
  const dataSource = { query: vi.fn() };
  let service: RankingService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new RankingService(dataSource as never);
  });

  it('calculates standings from official wins and draws using 3/1/0 points', async () => {
    dataSource.query.mockResolvedValue([
      { equipoId: 7, ganadorId: 7, puntajeEquipo: 3, puntajeRival: 1 },
      { equipoId: 8, ganadorId: 7, puntajeEquipo: 1, puntajeRival: 3 },
      { equipoId: 7, ganadorId: null, puntajeEquipo: 2, puntajeRival: 2 },
      { equipoId: 9, ganadorId: null, puntajeEquipo: 2, puntajeRival: 2 },
    ]);

    await expect(service.findByTorneo(12)).resolves.toEqual([
      {
        torneoId: 12,
        equipoId: 7,
        partidosJugados: 2,
        victorias: 1,
        empates: 1,
        derrotas: 0,
        puntos: 4,
        puntosAFavor: 5,
        puntosEnContra: 3,
      },
      {
        torneoId: 12,
        equipoId: 9,
        partidosJugados: 1,
        victorias: 0,
        empates: 1,
        derrotas: 0,
        puntos: 1,
        puntosAFavor: 2,
        puntosEnContra: 2,
      },
      {
        torneoId: 12,
        equipoId: 8,
        partidosJugados: 1,
        victorias: 0,
        empates: 0,
        derrotas: 1,
        puntos: 0,
        puntosAFavor: 1,
        puntosEnContra: 3,
      },
    ]);
    expect(dataSource.query).toHaveBeenCalledWith(
      expect.stringContaining('INNER JOIN partidos'),
      [12, 12],
    );
  });

  it('returns an empty ranking when a tournament has no official results', async () => {
    dataSource.query.mockResolvedValue([]);

    await expect(service.findByTorneo(3)).resolves.toEqual([]);
  });
});
