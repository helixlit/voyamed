import { randomUUID } from "crypto";
import { Client } from "mollie-api-typescript";
import { BalanceTransferCategory } from "mollie-api-typescript/models";

const client = new Client({
    security: {
        advancedAccessToken: ""
    },
});

export async function balanceTransfer(
    amount: number,
    description: string,
    category: BalanceTransferCategory,
    oderId: string,
    customerId: string,
) {
    const result = await client.balanceTransfers.create({
        idempotencyKey: randomUUID(),
        entityBalanceTransfer: {
            amount: {
                currency: "EUR",
                value: amount.toString(),
            },
            source: {
                type: "organization",
                id: "",
                description: description,
            },
            destination: {
                type: "organization",
                id: "",
                description: description,
            },
            description: description,
            category: category,
            metadata: {
                "order_id": oderId,
                "customer_id": customerId,
            },
            testmode: true,
        },
    });
}