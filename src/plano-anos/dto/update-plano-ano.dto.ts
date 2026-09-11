import { OmitType, PartialType } from '@nestjs/mapped-types';

import { CreatePlanoAnoDto } from './create-plano-ano.dto.js';

export class UpdatePlanoAnoDto extends PartialType(
  OmitType(CreatePlanoAnoDto, ['id_plan'] as const),
) {}
