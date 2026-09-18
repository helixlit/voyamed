import { contract, rpc } from '@prisma/composer/service-rpc';
import { type } from 'arktype';

export const article = type({
    pzn: 'string',
    name: 'string',
    active: 'boolean',
    supplier: 'string',
    unit: 'string',
    purchaseUnit: 'number',
    priceCents: 'number',
});

export type Article = typeof article.infer;

export const shopArticle = type({
    id: 'number',
    pzn: 'string',
    article: article,
})

export type ShopArticle = typeof shopArticle.infer;


export const catalogContract = contract({
    getShopArticles: rpc({
        input: type({ query: 'string', take: 'number', skip: 'number' }),
        output: type({ shopArticles: shopArticle.array() })
    }),
    getShopArticleByPZN: rpc({
        input: type({ pzn: 'string' }),
        output: type({ shopArticle })
    }),
    getShopArticleCount: rpc({
        input: type({ query: 'string' }),
        output: type({ count: 'number' })
    }),
    addShopArticles: rpc({
        input: type({ articlePZNs: 'string[]' }),
        output: type({ created: 'number' })
    })
});