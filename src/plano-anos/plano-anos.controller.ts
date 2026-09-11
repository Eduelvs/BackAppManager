import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import type { AuthUser } from '../common/decorators/current-user.decorator.js';
import { CreatePlanoAnoDto } from './dto/create-plano-ano.dto.js';
import { UpdatePlanoAnoDto } from './dto/update-plano-ano.dto.js';
import { PlanoAnosService } from './plano-anos.service.js';

@Controller('plano-anos')
export class PlanoAnosController {
  constructor(private readonly planoAnosService: PlanoAnosService) {}

  @Get()
  findAll(
    @CurrentUser() user: AuthUser,
    @Query('id_plan', ParseUUIDPipe) idPlan: string,
  ) {
    return this.planoAnosService.findAll(user.id, idPlan);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: AuthUser) {
    return this.planoAnosService.findOne(id, user.id);
  }

  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreatePlanoAnoDto) {
    return this.planoAnosService.create(user.id, dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthUser,
    @Body() dto: UpdatePlanoAnoDto,
  ) {
    return this.planoAnosService.update(id, user.id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: AuthUser) {
    return this.planoAnosService.remove(id, user.id);
  }
}
