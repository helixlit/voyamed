"use client";

import ArticleSearch from "./article-search";
import { useEffect, useState } from "react";
import ArticlePagination from "./article-pagination";
import Article from "./article";
import { ShopArticle } from "@voyamed/catalog/contract";
import { ArticleWithId } from "@/utils/types";

export default function ArticleBrowser() {
  const [query, setQuery] = useState<string>("");

  const [queriedArticles, setQueriedArticles] = useState<Array<ArticleWithId>>(
    [],
  );
  const [queriedArticleCount, setQueriedArticleCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(1);

  const take = 10;

  async function queryPrisma() {
    setIsLoading(true);
    setLoadError(null);
    try {
      const [articleResponse, countResponse] = await Promise.all([
        fetch(`/api/shop-articles?query=${encodeURIComponent(query)}&take=${take}&skip=${take * (currentPage - 1)}`),
        fetch(`/api/shop-articles/count?query=${encodeURIComponent(query)}`),
      ]);
      if (!articleResponse.ok || !countResponse.ok) throw new Error();

      const shopArticles: Array<ShopArticle> = await articleResponse.json();
      setQueriedArticles(shopArticles.map((s) => ({ id: s.pzn, ...s.article })));
      const count: number = (await countResponse.json()).count;
      setQueriedArticleCount(count);
    } catch {
      setLoadError("Artikel konnten gerade nicht geladen werden. Bitte erneut versuchen.");
      setQueriedArticles([]);
      setQueriedArticleCount(0);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    queryPrisma();
  }, [currentPage]);

  useEffect(() => {
    const setAsyncCurrentPage = async () => {
      setCurrentPage(1);
    }
    if (currentPage != 1) setAsyncCurrentPage();

    const timeout = setTimeout(async () => {
      queryPrisma();
    }, 500);

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <section className="w-full overflow-hidden rounded-2xl bg-secondary text-background shadow-sm">
      <div className="flex flex-col gap-3 px-4 py-5 sm:flex-row sm:items-center sm:gap-5 sm:px-6">
        <div className="shrink-0">
          <h2 className="text-xl font-semibold">Artikelsuche</h2>
          <p className="text-sm text-background/70">Finde die passenden Reiseartikel.</p>
        </div>
        <div className=" relative w-full h-full min-w-0">
          <ArticleSearch
            query={query}
            setQuery={setQuery}
            articles={queriedArticles}
            setArticles={setQueriedArticles}
            take={take}
            skip={take * (currentPage - 1)}
          />
        </div>
      </div>
      <div className="min-h-72 bg-white/15 p-3 sm:p-5">
        {isLoading ? (
          <div className="grid min-h-60 place-items-center text-sm text-background/75">
            <span className="animate-pulse">Artikel werden geladen …</span>
          </div>
        ) : loadError ? (
          <div role="alert" className="rounded-xl bg-tertiary/25 p-4 text-sm">{loadError}</div>
        ) : queriedArticles && (
          <ul className="grid gap-3 sm:gap-4">
            {queriedArticles.length > 0 ? (
              queriedArticles.map((a) => {
                const article = { pzn: a.id, ...a };
                return <Article article={article} key={article.pzn} />;
              })
            ) : (
              <li key="li-no-results" className="rounded-xl bg-background/10 p-5 text-center text-sm text-background/80">Keine passenden Artikel gefunden.</li>
            )}
          </ul>
        )}
      </div>
      <ArticlePagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        queriedArticleCount={queriedArticleCount}
      />
    </section>
  );
}
