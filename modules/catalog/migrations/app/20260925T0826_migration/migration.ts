#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/3115d00552e5cdb6493ab73a16b1b01c94420b62b373ddde5aa0aab4b2d283cf/contract';
import startContract from '../../snapshots/3115d00552e5cdb6493ab73a16b1b01c94420b62b373ddde5aa0aab4b2d283cf/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/9e193d197b4f4277f11f99924cfcc2d015920b7da7a161a5de563ea1bad61bc6/contract';
import endContract from '../../snapshots/9e193d197b4f4277f11f99924cfcc2d015920b7da7a161a5de563ea1bad61bc6/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  col,
  placeholder,
  primaryKey,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropTable({ schema: 'public', table: 'shopArticle' }),
      this.createTable({
        schema: 'public',
        table: 'articleCategory',
        columns: [
          col('articlePzn', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('categoryId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['articlePzn', 'categoryId'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'articleIndication',
        columns: [
          col('articlePzn', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('indicationName', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['articlePzn', 'indicationName'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'category',
        columns: [
          col('active', 'bool', { notNull: true, codecRef: { codecId: 'pg/bool@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('modificationDate', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('parentId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'indication',
        columns: [
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('searchTerms', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['name'])],
      }),
      this.addColumn({
        schema: 'public',
        table: 'article',
        column: col('description', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'article',
        column: col('searchTerms', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'article',
        column: col('simpleName', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'article',
        column: col('dosageForm', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.dataTransform(endContract, 'backfill-article-dosageForm', {
        check: () => placeholder('backfill-article-dosageForm:check'),
        run: () => placeholder('backfill-article-dosageForm:run'),
      }),
      this.setNotNull({ schema: 'public', table: 'article', column: 'dosageForm' }),
      this.addColumn({
        schema: 'public',
        table: 'article',
        column: col('purchasePrice', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
      }),
      this.dataTransform(endContract, 'backfill-article-purchasePrice', {
        check: () => placeholder('backfill-article-purchasePrice:check'),
        run: () => placeholder('backfill-article-purchasePrice:run'),
      }),
      this.setNotNull({ schema: 'public', table: 'article', column: 'purchasePrice' }),
      this.createIndex({
        schema: 'public',
        table: 'articleCategory',
        index: 'articleCategory_articlePzn_idx_6862e36c',
        columns: ['articlePzn'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'articleCategory',
        index: 'articleCategory_categoryId_idx_15c304f2',
        columns: ['categoryId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'articleIndication',
        index: 'articleIndication_articlePzn_idx_6862e36c',
        columns: ['articlePzn'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'articleIndication',
        index: 'articleIndication_indicationName_idx_1c5c28b5',
        columns: ['indicationName'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'category',
        index: 'category_parentId_idx_6a68f597',
        columns: ['parentId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'articleCategory',
        foreignKey: {
          name: 'articleCategory_articlePzn_fkey',
          columns: ['articlePzn'],
          references: { schema: 'public', table: 'article', columns: ['pzn'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'articleCategory',
        foreignKey: {
          name: 'articleCategory_categoryId_fkey',
          columns: ['categoryId'],
          references: { schema: 'public', table: 'category', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'articleIndication',
        foreignKey: {
          name: 'articleIndication_articlePzn_fkey',
          columns: ['articlePzn'],
          references: { schema: 'public', table: 'article', columns: ['pzn'] },
        },
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
      this.addForeignKey({
        schema: 'public',
        table: 'category',
        foreignKey: {
          name: 'category_parentId_fkey',
          columns: ['parentId'],
          references: { schema: 'public', table: 'category', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
