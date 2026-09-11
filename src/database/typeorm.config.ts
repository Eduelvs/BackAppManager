import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import type { DataSourceOptions } from 'typeorm';

import { PlanoAnoMes } from '../plano-ano-meses/entities/plano-ano-mes.entity.js';
import { PlanoAno } from '../plano-anos/entities/plano-ano.entity.js';
import { Plano } from '../planos/entities/plano.entity.js';
import { User } from '../users/entities/user.entity.js';

const dir = dirname(fileURLToPath(import.meta.url));

function shouldUseSsl(env: NodeJS.ProcessEnv, url?: string, host?: string): boolean {
  if (env.PGSSL === 'false' || env.DATABASE_SSL === 'false') return false;
  if (env.PGSSL === 'true' || env.DATABASE_SSL === 'true') return true;

  const target = `${url ?? ''} ${host ?? ''}`.toLowerCase();
  if (
    target.includes('localhost') ||
    target.includes('127.0.0.1') ||
    target.includes('railway.internal')
  ) {
    return false;
  }

  return Boolean(url || host);
}

export function buildTypeOrmOptions(env: NodeJS.ProcessEnv): DataSourceOptions {
  const url = env.DATABASE_URL;
  const host = env.PGHOST;
  const username = env.PGUSER ?? env.POSTGRES_USER;
  const password = env.PGPASSWORD ?? env.POSTGRES_PASSWORD;
  const database = env.PGDATABASE ?? env.POSTGRES_DB;
  const port = Number(env.PGPORT ?? 5432);

  if (!url && (!host || !username || password === undefined || !database)) {
    throw new Error(
      'Defina DATABASE_URL ou PGHOST, PGPORT, PGUSER, PGPASSWORD e PGDATABASE no .env',
    );
  }

  const synchronize = env.DB_SYNC === 'true';
  const ssl = shouldUseSsl(env, url, host)
    ? { rejectUnauthorized: false }
    : false;

  return {
    type: 'postgres',
    ...(url
      ? { url }
      : {
          host,
          port,
          username,
          password,
          database,
        }),
    ssl,
    entities: [User, Plano, PlanoAno, PlanoAnoMes],
    migrations: [join(dir, 'migrations', '*.js')],
    synchronize,
    migrationsRun: !synchronize,
  };
}
