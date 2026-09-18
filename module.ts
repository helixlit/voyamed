import { module } from '@prisma/composer';
import { envSecret } from '@prisma/composer-prisma-cloud'
import catalogModule from '@voyamed/catalog';
import storefrontService from '@voyamed/storefront';

export default module('voyamed', ({ provision }) => {
    const catalog = provision(catalogModule, {
        secrets: {
            antoniusUrl: envSecret('BASE_URL'),
            antoniusUser: envSecret('USERNAME'),
            antoniusPassword: envSecret('PASSWORD'),
        },
    });

    provision(storefrontService, {
        deps: { catalog: catalog.rpc },
        input: {
            stripeSecretKey: envSecret('STRIPE_SECRET_KEY'),
        }
    })
});