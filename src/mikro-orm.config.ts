import { defineConfig } from '@mikro-orm/core';
import { Migrator } from '@mikro-orm/migrations';
import { EntityManager, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { AsyncLocalStorage } from 'async_hooks';
import 'dotenv/config';

import appConfig from './config/configuration';

const config = appConfig();
const storage = new AsyncLocalStorage<EntityManager>();

export default defineConfig({
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  driver: PostgreSqlDriver,
  driverOptions: {
    connection: {
      ssl: false,
    },
  },
  host: config.database.host,
  port: config.database.port,
  user: config.database.user,
  password: config.database.password,
  dbName: config.database.name,
  schema: config.database.schema,
  debug: false,
  context: () => storage.getStore(),
  extensions: [Migrator] as const,
  migrations: {
    tableName: 'migrations',
    disableForeignKeys: false,
    path: 'dist/src/migrations',
    pathTs: 'src/migrations',
    snapshotName: '.snapshot-from-poland',
  },
});
