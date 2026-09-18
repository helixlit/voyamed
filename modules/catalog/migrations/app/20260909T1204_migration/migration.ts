#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/3115d00552e5cdb6493ab73a16b1b01c94420b62b373ddde5aa0aab4b2d283cf/contract';
import endContract from '../../snapshots/3115d00552e5cdb6493ab73a16b1b01c94420b62b373ddde5aa0aab4b2d283cf/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'article',
        columns: [
          col('active', 'bool', { notNull: true, codecRef: { codecId: 'pg/bool@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('priceCents', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('purchaseUnit', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('pzn', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('supplier', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('unit', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['pzn'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'shopArticle',
        columns: [
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('pzn', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createIndex({
        schema: 'public',
        table: 'shopArticle',
        index: 'shopArticle_pzn_idx_6de239b7',
        columns: ['pzn'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'shopArticle',
        foreignKey: {
          name: 'shopArticle_pzn_fkey',
          columns: ['pzn'],
          references: { schema: 'public', table: 'article', columns: ['pzn'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
