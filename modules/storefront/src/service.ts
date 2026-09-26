import nextjs from '@prisma/composer/nextjs';
import { rpc } from '@prisma/composer/service-rpc';
import { compute } from '@prisma/composer-prisma-cloud';
import { secretString } from '@prisma/composer/arktype';
import { catalogContract } from '@voyamed/catalog/contract';
import { type } from 'arktype';

const input = type({
    stripeSecretKey: secretString(),
    stripeWebhookSecret: secretString(),
    resendApiKey: secretString(),
    orderNotificationEmail: secretString(),
    orderNotificationFrom: secretString(),
});

export default compute({
    name: 'storefront',
    input: input,
    deps: {
        catalog: rpc(catalogContract),
    },
    build: nextjs({ module: import.meta.url, appDir: '..' }),
});
