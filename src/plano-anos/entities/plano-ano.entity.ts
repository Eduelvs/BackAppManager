import { randomUUID } from 'node:crypto';

import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  Unique,
} from 'typeorm';

import { numericTransformer } from '../../common/transformers/numeric.transformer.js';
import { Plano } from '../../planos/entities/plano.entity.js';
import { PlanoAnoMes } from '../../plano-ano-meses/entities/plano-ano-mes.entity.js';

@Entity('plano_ano')
@Unique(['id_plan', 'ano'])
export class PlanoAno {
  @PrimaryColumn('uuid')
  id: string;

  @BeforeInsert()
  generateId() {
    if (!this.id) this.id = randomUUID();
  }

  @Column({ type: 'int' })
  ano: number;

  @Column({
    name: 'valor_mensal',
    type: 'decimal',
    precision: 12,
    scale: 2,
    transformer: numericTransformer,
  })
  valor_mensal: number;

  @Column({
    type: 'decimal',
    precision: 8,
    scale: 4,
    transformer: numericTransformer,
  })
  taxa: number;

  @Column({ name: 'id_plan', type: 'uuid' })
  id_plan: string;

  @ManyToOne(() => Plano, (plano) => plano.anos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_plan' })
  plano: Plano;

  @OneToMany(() => PlanoAnoMes, (mes) => mes.planoAno)
  meses: PlanoAnoMes[];
}
