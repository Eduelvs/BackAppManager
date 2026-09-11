import { randomUUID } from 'node:crypto';

import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity.js';
import { PlanoAno } from '../../plano-anos/entities/plano-ano.entity.js';

@Entity('plano')
export class Plano {
  @PrimaryColumn('uuid')
  id: string;

  @BeforeInsert()
  generateId() {
    if (!this.id) this.id = randomUUID();
  }

  @Column()
  nome: string;

  @Column({ name: 'id_user', type: 'uuid' })
  id_user: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_user' })
  user: User;

  @OneToMany(() => PlanoAno, (ano) => ano.plano)
  anos: PlanoAno[];
}
