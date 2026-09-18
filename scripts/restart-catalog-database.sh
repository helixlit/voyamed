cd

npx prisma@7.10.0 dev stop pcdev-voyamed-catalog-database

sudo -v
sudo fuser -k 51304/tcp
sudo fuser -k 51305/tcp
sudo fuser -k 51310/tcp
sudo fuser -k 51218/tcp

npx prisma@7.10.0 dev start pcdev-voyamed-catalog-database