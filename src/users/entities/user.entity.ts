import { randomUUID } from 'node:crypto';

import { Exclude } from 'class-transformer';
import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryColumn('uuid')
  id: string;

  @BeforeInsert()
  generateId() {
    if (!this.id) this.id = randomUUID();
  }

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column({ select: false })
  password: string;
}
