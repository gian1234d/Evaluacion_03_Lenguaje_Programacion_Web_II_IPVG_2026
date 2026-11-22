import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Usuario } from '../usuarios/entities/usuario.entity.js';
import { RegistroDto } from './dto/registro.dto.js';
import { LoginDto } from './dto/login.dto.js';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private usuariosRepo: Repository<Usuario>,
    private jwtService: JwtService,
  ) {}

  async registro(dto: RegistroDto) {
    const existe = await this.usuariosRepo.findOne({
      where: [{ correo: dto.correo }, { alias: dto.alias }],
    });
    if (existe)
      throw new ConflictException('El correo o alias ya está registrado');

    const hash = await bcrypt.hash(dto.password, 10);
    const usuario = this.usuariosRepo.create({ ...dto, password: hash });
    const guardado = await this.usuariosRepo.save(usuario);
    const { password, ...resultado } = guardado;
    return resultado;
  }

  async login(dto: LoginDto) {
    const usuario = await this.usuariosRepo.findOne({
      where: { correo: dto.correo },
    });
    if (!usuario?.activo)
      throw new UnauthorizedException('Credenciales inválidas');

    const valido = await bcrypt.compare(dto.password, usuario.password);
    if (!valido) throw new UnauthorizedException('Credenciales inválidas');

    const payload = {
      sub: usuario.id,
      correo: usuario.correo,
      rol: usuario.rol,
    };
    return {
      access_token: this.jwtService.sign(payload),
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        alias: usuario.alias,
        correo: usuario.correo,
        rol: usuario.rol,
      },
    };
  }
}
