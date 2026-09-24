import node from '@prisma/composer/node'
import { compute } from '@prisma/composer-prisma-cloud'
import { ordersContract } from './contract'
import { secretString } from '@prisma/composer/arktype'
import { type } from 'arktype'

const input = type({
    stripeSecretKey: secretString(),
    stripeWebhookSecret: secretString(),
})

export default compute({
    name: 'orders',
    input: input,
    deps: {},
    build: node({
        module: import.meta.url, entry: '../dist/server.mjs'
    }),
    expose: { rpc: ordersContract },
});