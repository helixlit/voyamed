import node from '@prisma/composer/node';
import { compute } from '@prisma/composer-prisma-cloud';
import { postgres } from '@prisma/composer-prisma-cloud/orm';
import { catalogContract } from './contract.ts';
import { catalogData } from './data.ts';
import { secretString } from '@prisma/composer/arktype';
import { type } from 'arktype';

const input = type({
    antoniusUrl: secretString(),
    antoniusUser: secretString(),
    antoniusPassword: secretString(),
});

export default compute({
    name: 'catalog',
    input: input,
    deps: {
        db: postgres(catalogData),
    },
    build: node({ module: import.meta.url, entry: '../dist/server.mjs' }),
    expose: { rpc: catalogContract },
});