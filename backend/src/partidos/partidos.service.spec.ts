import { BadRequestException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PartidosService } from './partidos.service.js';

describe('PartidosService', () => {
  const partidoRepository = {
    create: vi.fn((value) => value),
    save: vi.fn(async (value) => ({ id: 1, ...value })),
    find: vi.fn(),
    findOne: vi.fn(),
  };
  const manager = { query: vi.fn(), getRepository: () => partidoRepository };
  const dataSource = { transaction: vi.fn((work) => work(manager)) };
  let service: PartidosService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new PartidosService(
      partidoRepository as never,
      dataSource as never,
    );
  });

  it('rejects a match when both team ids are the same', async () => {
    await expect(
      service.create({
        torneoId: 1,
        equipoLocalId: 4,
        equipoVisitanteId: 4,
        fechaProgramada: new Date(),
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(manager.query).not.toHaveBeenCalled();
  });

  it('rejects a match if either team is not enrolled in the tournament', async () => {
    manager.query
      .mockResolvedValueOnce([{ id: 1 }])
      .mockResolvedValueOnce([{ equipoId: 4 }]);

    await expect(
      service.create({
        torneoId: 1,
        equipoLocalId: 4,
        equipoVisitanteId: 5,
        fechaProgramada: new Date(),
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(partidoRepository.save).not.toHaveBeenCalled();
  });

  it('saves a match when both teams are enrolled', async () => {
    manager.query
      .mockResolvedValueOnce([{ id: 1 }])
      .mockResolvedValueOnce([{ equipoId: 4 }, { equipoId: 5 }]);

    await expect(
      service.create({
        torneoId: 1,
        equipoLocalId: 4,
        equipoVisitanteId: 5,
        fechaProgramada: new Date(),
      }),
    ).resolves.toMatchObject({ id: 1, torneoId: 1 });
    expect(partidoRepository.save).toHaveBeenCalledOnce();
  });
});
