import { definePrismaConfig } from '@prisma/cli-engine';
import { defineConfig } from '@prisma/orm-postgres/config';

// Regenerate contract.{json,d.ts}: prisma contract emit --config prisma.config.ts
export default definePrismaConfig({
    orm: defineConfig({
        contract: './contract.prisma',
        // db: { connection: 'postgres://postgres:postgres@localhost:51300/template1?sslmode=disable' },
    }),

});