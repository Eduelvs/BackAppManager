import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PlanosModule } from '../planos/planos.module.js';
import { PlanoAno } from './entities/plano-ano.entity.js';
import { PlanoAnosController } from './plano-anos.controller.js';
import { PlanoAnosService } from './plano-anos.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([PlanoAno]), PlanosModule],
  controllers: [PlanoAnosController],
  providers: [PlanoAnosService],
  exports: [PlanoAnosService],
})
export class PlanoAnosModule {}
