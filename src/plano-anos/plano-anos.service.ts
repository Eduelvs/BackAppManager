import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';

import { PlanosService } from '../planos/planos.service.js';
import { CreatePlanoAnoDto } from './dto/create-plano-ano.dto.js';
import { UpdatePlanoAnoDto } from './dto/update-plano-ano.dto.js';
import { PlanoAno } from './entities/plano-ano.entity.js';

@Injectable()
export class PlanoAnosService {
  constructor(
    @InjectRepository(PlanoAno)
    private readonly planoAnosRepo: Repository<PlanoAno>,
    private readonly planosService: PlanosService,
  ) {}

  async findAll(userId: string, idPlan: string) {
    await this.planosService.findOwned(idPlan, userId);
    return this.planoAnosRepo.find({
      where: { id_plan: idPlan },
      relations: { meses: true },
      order: { ano: 'ASC', meses: { mes: 'ASC' } },
    });
  }

  async findOne(id: string, userId: string) {
    const planoAno = await this.planoAnosRepo.findOne({
      where: { id },
      relations: { plano: true, meses: true },
      order: { meses: { mes: 'ASC' } },
    });
    if (!planoAno || planoAno.plano.id_user !== userId) {
      throw new NotFoundException('Ano do plano não encontrado.');
    }
    return planoAno;
  }

  async create(userId: string, dto: CreatePlanoAnoDto) {
    await this.planosService.findOwned(dto.id_plan, userId);
    await this.assertYearAvailable(dto.id_plan, dto.ano);

    const planoAno = this.planoAnosRepo.create({
      id_plan: dto.id_plan,
      ano: dto.ano,
      valor_mensal: dto.valor_mensal,
      taxa: dto.taxa,
    });
    return this.planoAnosRepo.save(planoAno);
  }

  async update(id: string, userId: string, dto: UpdatePlanoAnoDto) {
    const planoAno = await this.findOne(id, userId);

    if (dto.ano !== undefined && dto.ano !== planoAno.ano) {
      await this.assertYearAvailable(planoAno.id_plan, dto.ano, planoAno.id);
      planoAno.ano = dto.ano;
    }
    if (dto.valor_mensal !== undefined) {
      planoAno.valor_mensal = dto.valor_mensal;
    }
    if (dto.taxa !== undefined) {
      planoAno.taxa = dto.taxa;
    }

    return this.planoAnosRepo.save(planoAno);
  }

  async remove(id: string, userId: string) {
    const planoAno = await this.findOne(id, userId);
    await this.planoAnosRepo.remove(planoAno);
  }

  async findOwned(id: string, userId: string) {
    return this.findOne(id, userId);
  }

  private async assertYearAvailable(idPlan: string, ano: number, exceptId?: string) {
    const existing = await this.planoAnosRepo.findOne({
      where: exceptId
        ? { id_plan: idPlan, ano, id: Not(exceptId) }
        : { id_plan: idPlan, ano },
    });
    if (existing) {
      throw new ConflictException('Esse ano já está configurado neste plano.');
    }
  }
}
