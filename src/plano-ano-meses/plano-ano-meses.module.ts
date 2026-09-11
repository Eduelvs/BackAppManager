import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PlanoAnosModule } from '../plano-anos/plano-anos.module.js';
import { PlanoAnoMes } from './entities/plano-ano-mes.entity.js';
import { PlanoAnoMesesController } from './plano-ano-meses.controller.js';
import { PlanoAnoMesesService } from './plano-ano-meses.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([PlanoAnoMes]), PlanoAnosModule],
  controllers: [PlanoAnoMesesController],
  providers: [PlanoAnoMesesService],
})
export class PlanoAnoMesesModule {}
