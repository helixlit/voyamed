pnpm build $1 $2

set -a
. $(pwd)/.env
set +a

pnpm exec prisma dev module.ts