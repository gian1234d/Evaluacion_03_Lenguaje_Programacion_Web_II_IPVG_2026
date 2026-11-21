import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';

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

  async findAll(): Promise<Omit<Usuario, 'password'>[]> {
    const usuarios = await this.usuariosRepo.find({ where: { activo: true } });
    return usuarios.map(({ password, ...u }) => u);
  }
}