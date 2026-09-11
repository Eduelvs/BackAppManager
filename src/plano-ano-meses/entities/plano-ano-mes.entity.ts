import { randomUUID } from 'node:crypto';

import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Unique,
} from 'typeorm';

import { numericTransformer } from '../../common/transformers/numeric.transformer.js';
import { PlanoAno } from '../../plano-anos/entities/plano-ano.entity.js';

@Entity('plano_ano_mes')
@Unique(['id_plano_ano', 'mes'])
export class PlanoAnoMes {
  @PrimaryColumn('uuid')
  id: string;

  @BeforeInsert()
  generateId() {
    if (!this.id) this.id = randomUUID();
  }

  @Column({ name: 'id_plano_ano', type: 'uuid' })
  id_plano_ano: string;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    transformer: numericTransformer,
  })
  valor: number;

  @Column({ type: 'smallint' })
  mes: number;

  @ManyToOne(() => PlanoAno, (planoAno) => planoAno.meses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_plano_ano' })
  planoAno: PlanoAno;
}
