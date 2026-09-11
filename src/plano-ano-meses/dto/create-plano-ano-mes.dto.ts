import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsUUID, Max, Min } from 'class-validator';

export class CreatePlanoAnoMesDto {
  @IsUUID()
  id_plano_ano: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  valor: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(12)
  mes: number;
}
