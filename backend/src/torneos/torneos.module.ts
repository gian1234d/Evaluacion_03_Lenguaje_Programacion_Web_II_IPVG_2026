import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminGuard } from './admin.guard.js';
import { Torneo } from './torneo.entity.js';
import { TorneosController } from './torneos.controller.js';
import { TorneosService } from './torneos.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Torneo])],
  controllers: [TorneosController],
  providers: [TorneosService, AdminGuard],
  exports: [TorneosService],
})
export class TorneosModule {}
