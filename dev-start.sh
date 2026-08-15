npx prisma dev &
PRISMA_PID=$!

npx prisma studio &
STUDIO_PID=$!

pnpm dev

kill $PRISMA_PID $STUDIO_PID