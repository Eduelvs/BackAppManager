import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';

import { PlanoAnosService } from '../plano-anos/plano-anos.service.js';
import { CreatePlanoAnoMesDto } from './dto/create-plano-ano-mes.dto.js';
import { UpdatePlanoAnoMesDto } from './dto/update-plano-ano-mes.dto.js';
import { PlanoAnoMes } from './entities/plano-ano-mes.entity.js';

@Injectable()
export class PlanoAnoMesesService {
  constructor(
    @InjectRepository(PlanoAnoMes)
    private readonly mesesRepo: Repository<PlanoAnoMes>,
    private readonly planoAnosService: PlanoAnosService,
  ) {}

  async findAll(userId: string, idPlanoAno: string) {
    await this.planoAnosService.findOwned(idPlanoAno, userId);
    return this.mesesRepo.find({
      where: { id_plano_ano: idPlanoAno },
      order: { mes: 'ASC' },
    });
  }

  async findOne(id: string, userId: string) {
    const mes = await this.mesesRepo.findOne({
      where: { id },
      relations: { planoAno: { plano: true } },
    });
    if (!mes || mes.planoAno.plano.id_user !== userId) {
      throw new NotFoundException('Aporte do mês não encontrado.');
    }
    return mes;
  }

  async create(userId: string, dto: CreatePlanoAnoMesDto) {
    await this.planoAnosService.findOwned(dto.id_plano_ano, userId);
    await this.assertMonthAvailable(dto.id_plano_ano, dto.mes);

    const mes = this.mesesRepo.create({
      id_plano_ano: dto.id_plano_ano,
      valor: dto.valor,
      mes: dto.mes,
    });
    return this.mesesRepo.save(mes);
  }

  async update(id: string, userId: string, dto: UpdatePlanoAnoMesDto) {
    const mes = await this.findOne(id, userId);

    if (dto.mes !== undefined && dto.mes !== mes.mes) {
      await this.assertMonthAvailable(mes.id_plano_ano, dto.mes, mes.id);
      mes.mes = dto.mes;
    }
    if (dto.valor !== undefined) {
      mes.valor = dto.valor;
    }

    return this.mesesRepo.save(mes);
  }

  private async assertMonthAvailable(
    idPlanoAno: string,
    mes: number,
    exceptId?: string,
  ) {
    const existing = await this.mesesRepo.findOne({
      where: exceptId
        ? { id_plano_ano: idPlanoAno, mes, id: Not(exceptId) }
        : { id_plano_ano: idPlanoAno, mes },
    });
    if (existing) {
      throw new ConflictException('Este mês já possui um aporte neste ano.');
    }
  }
}
