import 'dotenv/config';

import { DataSource } from 'typeorm';

import { buildTypeOrmOptions } from './typeorm.config.js';

export default new DataSource(buildTypeOrmOptions(process.env));
