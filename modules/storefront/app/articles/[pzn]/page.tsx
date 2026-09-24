import Article from "@/app/configurator/article";
import service from "@/src/service";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{
    pzn: string;
  }>;
};

export default async function ArticlePage({ params }: Props) {
  const { catalog } = service.load();
  const { pzn } = await params;

  const shopArticle = (await catalog.getShopArticlesByPZNs({ pzns: [pzn] })).shopArticles[0];

  if (!shopArticle) notFound();

  return (
    <section id="articles-page">
      <Article article={shopArticle.article} />
    </section>
  )
}