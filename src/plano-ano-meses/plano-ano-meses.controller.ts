import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import type { AuthUser } from '../common/decorators/current-user.decorator.js';
import { CreatePlanoAnoMesDto } from './dto/create-plano-ano-mes.dto.js';
import { UpdatePlanoAnoMesDto } from './dto/update-plano-ano-mes.dto.js';
import { PlanoAnoMesesService } from './plano-ano-meses.service.js';

@Controller('plano-ano-meses')
export class PlanoAnoMesesController {
  constructor(private readonly planoAnoMesesService: PlanoAnoMesesService) {}

  @Get()
  findAll(
    @CurrentUser() user: AuthUser,
    @Query('id_plano_ano', ParseUUIDPipe) idPlanoAno: string,
  ) {
    return this.planoAnoMesesService.findAll(user.id, idPlanoAno);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: AuthUser) {
    return this.planoAnoMesesService.findOne(id, user.id);
  }

  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreatePlanoAnoMesDto) {
    return this.planoAnoMesesService.create(user.id, dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthUser,
    @Body() dto: UpdatePlanoAnoMesDto,
  ) {
    return this.planoAnoMesesService.update(id, user.id, dto);
  }
}
