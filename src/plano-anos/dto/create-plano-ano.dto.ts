import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsUUID, Max, Min } from 'class-validator';

export class CreatePlanoAnoDto {
  @IsUUID()
  id_plan: string;

  @Type(() => Number)
  @IsInt()
  @Min(1900)
  @Max(2200)
  ano: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  valor_mensal: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0)
  taxa: number;
}
