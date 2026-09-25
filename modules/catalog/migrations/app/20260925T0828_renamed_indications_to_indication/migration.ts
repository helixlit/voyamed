#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/734b7f1183c5f4e551da8022a39843d19ca5c641d614c80c8308e71987a357a3/contract';
import startContract from '../../snapshots/734b7f1183c5f4e551da8022a39843d19ca5c641d614c80c8308e71987a357a3/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/9e193d197b4f4277f11f99924cfcc2d015920b7da7a161a5de563ea1bad61bc6/contract';
import endContract from '../../snapshots/9e193d197b4f4277f11f99924cfcc2d015920b7da7a161a5de563ea1bad61bc6/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropConstraint({
        schema: 'public',
        table: 'articleIndication',
        constraint: 'articleIndication_indicationName_fkey',
        kind: 'foreignKey',
      }),
      this.dropTable({ schema: 'public', table: 'indications' }),
      this.createTable({
        schema: 'public',
        table: 'indication',
        columns: [
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('searchTerms', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['name'])],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'articleIndication',
        foreignKey: {
          name: 'articleIndication_indicationName_fkey',
          columns: ['indicationName'],
          references: { schema: 'public', table: 'indication', columns: ['name'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
