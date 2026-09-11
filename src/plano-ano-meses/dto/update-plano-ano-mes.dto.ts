import { OmitType, PartialType } from '@nestjs/mapped-types';

import { CreatePlanoAnoMesDto } from './create-plano-ano-mes.dto.js';

export class UpdatePlanoAnoMesDto extends PartialType(
  OmitType(CreatePlanoAnoMesDto, ['id_plano_ano'] as const),
) {}
