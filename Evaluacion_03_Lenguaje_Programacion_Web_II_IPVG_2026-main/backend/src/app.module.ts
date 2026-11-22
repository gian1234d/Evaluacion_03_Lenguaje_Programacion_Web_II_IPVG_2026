import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { EquiposModule } from './equipos/equipos.module';
import { Usuario } from './usuarios/entities/usuario.entity';
import { Equipo } from './equipos/entities/equipo.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || 'benja123',
      database: process.env.DB_DATABASE || 'gamehub_lpw2',
      entities: [Usuario, Equipo],
      synchronize: true,
    }),
    AuthModule,
    UsuariosModule,
    EquiposModule,
  ],
})
export class AppModule {}