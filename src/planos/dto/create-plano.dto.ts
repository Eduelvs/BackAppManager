import { IsString, MinLength } from 'class-validator';

export class CreatePlanoDto {
  @IsString()
  @MinLength(1)
  nome: string;
}
