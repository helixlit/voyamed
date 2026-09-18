import { fileURLToPath } from 'node:url';
import { module, secret } from '@prisma/composer';
import { postgres } from '@prisma/composer-prisma-cloud/orm';
import { catalogContract } from './contract.ts';
import { catalogData } from './data.ts';
import catalogService from './service.ts';

const config = fileURLToPath(new URL('../prisma.config.ts', import.meta.url));

export default module('catalog', {
    expose: { rpc: catalogContract },
    secrets: {
        antoniusUrl: secret(),
        antoniusUser: secret(),
        antoniusPassword: secret(),
    }
}, ({ provision, secrets }) => {
    const db = provision(
        postgres(
            { name: 'database', contract: catalogData, config: config }
        ), { id: 'database' });

    const service = provision(
        catalogService,
        {
            id: 'service',
            deps: { db },
            input: {
                antoniusUrl: secrets.antoniusUrl,
                antoniusUser: secrets.antoniusUser,
                antoniusPassword: secrets.antoniusPassword,
            }
        });
    return { rpc: service.rpc };
});