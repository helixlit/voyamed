import { contract, rpc } from '@prisma/composer/service-rpc';
import { type } from 'arktype';


const definitions = type.scope({
    category: {
        id: "string",
        name: "string",
        active: "boolean",
        modificationDate: "string",
        "parentId?": "string",
        categories: "category[]",
    },

    indication: {
        name: "string",
        searchTerms: "string",
    },

    articleCategory: {
        articlePzn: "string",
        categoryId: "string",
    },

    articleIndication: {
        articlePzn: "string",
        indicatinName: "string",
    },

    article: {
        pzn: "string",
        name: "string",
        active: "boolean",
        supplier: "string",
        unit: "string",
        purchaseUnit: "number",
        priceCents: "number",
        purchasePrice: "number",
        dosageForm: "string",
        description: "string",
        searchTerms: "string",
        simpleName: "string",
        articleCategories: "articleCategory[]",
        articleIndications: "articleIndication[]",
    },
});


export const { category, articleCategory, article } =
    definitions.export();

export type Category = typeof category.infer;
export type ArticleCategory = typeof articleCategory.infer;
export type Article = typeof article.infer;



export const catalogContract = contract({
    getArticlesByQuery: rpc({
        input: type({ query: 'string', take: 'number', skip: 'number' }),
        output: type({ articles: article.array() })
    }),
    getArticlesByPZNs: rpc({
        input: type({ pzns: 'string[]' }),
        output: type({ articles: article.array() })
    }),
    getArticleCountByQuery: rpc({
        input: type({ query: 'string' }),
        output: type({ count: 'number' })
    }),
});