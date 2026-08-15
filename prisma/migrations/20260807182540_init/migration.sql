-- CreateTable
CREATE TABLE "Article" (
    "pzn" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,
    "supplier" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "purchaseUnit" INTEGER NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "prescription" BOOLEAN,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("pzn")
);

-- CreateTable
CREATE TABLE "ShopArticle" (
    "id" SERIAL NOT NULL,
    "articlePZN" TEXT NOT NULL,

    CONSTRAINT "ShopArticle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShopArticle_articlePZN_key" ON "ShopArticle"("articlePZN");

-- AddForeignKey
ALTER TABLE "ShopArticle" ADD CONSTRAINT "ShopArticle_articlePZN_fkey" FOREIGN KEY ("articlePZN") REFERENCES "Article"("pzn") ON DELETE RESTRICT ON UPDATE CASCADE;
