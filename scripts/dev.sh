
set -a
. $(pwd)/.env
set +a

pnpm exec prisma dev $1 module.ts
