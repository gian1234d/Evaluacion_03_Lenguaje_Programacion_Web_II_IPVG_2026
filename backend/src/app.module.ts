import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { TorneosModule } from './torneos/torneos.module.js';
import { InscripcionesModule } from './inscripciones/inscripciones.module.js';
import { PartidosModule } from './partidos/partidos.module.js';
import { ResultadosModule } from './resultados/resultados.module.js';
import { RankingModule } from './ranking/ranking.module.js';

import { AuthModule } from './auth/auth.module.js';
import { UsuariosModule } from './usuarios/usuarios.module.js';
import { EquiposModule } from './equipos/equipos.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 3306),
        username: config.get('DB_USERNAME', 'root'),
        password: config.get('DB_PASSWORD', ''),
        database: config.get('DB_DATABASE', 'gamehub_lpw2'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    AuthModule,
    UsuariosModule,
    EquiposModule,
    TorneosModule,
    InscripcionesModule,
    PartidosModule,
    ResultadosModule,
    RankingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
