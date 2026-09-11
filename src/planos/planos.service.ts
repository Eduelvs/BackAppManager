import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Plano } from './entities/plano.entity.js';
import { CreatePlanoDto } from './dto/create-plano.dto.js';
import { UpdatePlanoDto } from './dto/update-plano.dto.js';

@Injectable()
export class PlanosService {
  constructor(
    @InjectRepository(Plano)
    private readonly planosRepo: Repository<Plano>,
  ) {}

  findAll(userId: string) {
    return this.planosRepo.find({
      where: { id_user: userId },
      relations: { anos: { meses: true } },
      order: { nome: 'ASC', anos: { ano: 'ASC', meses: { mes: 'ASC' } } },
    });
  }

  async findOne(id: string, userId: string) {
    const plano = await this.planosRepo.findOne({
      where: { id, id_user: userId },
      relations: { anos: { meses: true } },
      order: { anos: { ano: 'ASC', meses: { mes: 'ASC' } } },
    });
    if (!plano) {
      throw new NotFoundException('Plano não encontrado.');
    }
    return plano;
  }

  async create(userId: string, dto: CreatePlanoDto) {
    const plano = this.planosRepo.create({
      nome: dto.nome.trim(),
      id_user: userId,
    });
    return this.planosRepo.save(plano);
  }

  async update(id: string, userId: string, dto: UpdatePlanoDto) {
    const plano = await this.findOwned(id, userId);
    if (dto.nome) {
      plano.nome = dto.nome.trim();
    }
    return this.planosRepo.save(plano);
  }

  async remove(id: string, userId: string) {
    const plano = await this.findOwned(id, userId);
    await this.planosRepo.remove(plano);
  }

  async findOwned(id: string, userId: string) {
    const plano = await this.planosRepo.findOne({
      where: { id, id_user: userId },
    });
    if (!plano) {
      throw new NotFoundException('Plano não encontrado.');
    }
    return plano;
  }
}
