
read -p "Continue?[y/N]" answer


if [[ "$answer" == "y" || "$answer" == "Y"]]; then
echo "Continuing..."
rm -rf .alchemy
rm -rf .prisma-composer

cd
npx prisma@7.10.0 dev rm pcdev-voyamed-catalog-database --force

cd /home/helixlit/voyamed
BASE_URL="https://antoniusshoptestng.innowerk-it.de" \
USERNAME="reiseapothekeantonius" \
PASSWORD="kvRSUy0mad.HgzEHNXBaL?" \
pnpm exec prisma dev --fresh module.ts

cd
npx prisma@7.10.0 dev ls --debug

else
echo "Cancelled."
exit 1
fi