import { ActualizarPerfilDto } from './dto/actualizar-perfil.dto.js';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity.js';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private usuariosRepo: Repository<Usuario>,
  ) {}

  async findById(id: number): Promise<Omit<Usuario, 'password'>> {
    const usuario = await this.usuariosRepo.findOne({ where: { id } });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');
    const { password, ...resultado } = usuario;
    return resultado;
  }

  async actualizar(id: number, dto: ActualizarPerfilDto) {
    await this.findById(id);
    if (
      await this.usuariosRepo.exists({
        where: [
          { id: Not(id), correo: dto.correo },
          { id: Not(id), alias: dto.alias },
        ],
      })
    ) {
      throw new ConflictException('El correo o alias ya está registrado');
    }
    await this.usuariosRepo.update(id, dto);
    return this.findById(id);
  }

  async findAll() {
    const usuarios = await this.usuariosRepo.find({ where: { activo: true } });
    return usuarios.map(({ id, nombre, alias }) => ({ id, nombre, alias }));
  }
}
