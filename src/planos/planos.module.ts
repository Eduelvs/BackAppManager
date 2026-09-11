import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Plano } from './entities/plano.entity.js';
import { PlanosController } from './planos.controller.js';
import { PlanosService } from './planos.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Plano])],
  controllers: [PlanosController],
  providers: [PlanosService],
  exports: [PlanosService],
})
export class PlanosModule {}
