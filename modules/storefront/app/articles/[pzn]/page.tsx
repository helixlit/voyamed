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

  const article = (await catalog.getArticlesByPZNs({ pzns: [pzn] })).articles[0];

  if (!article) notFound();

  return (
    <section id="articles-page">
      <Article article={article} />
    </section>
  )
}