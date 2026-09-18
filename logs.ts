import { log } from '@prisma/composer/control';

const result = await log(
    { entry: 'module.ts', tail: 20, signal: AbortSignal.timeout(1800_000) }
);
if (!result.ok) throw new Error(result.failure.message);

for await (const { service, line } of result.value.lines) {
    console.log(`[${service}] ${line}`);
}