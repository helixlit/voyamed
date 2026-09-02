"use client";

import ArticleSearch from "./article-search";
import { useEffect, useState } from "react";
import { queryShopArticleCount, queryShopArticles } from "@/utils/query";
import ArticlePagination from "./article-pagination";
import Article from "./article";
import { ArticleClient } from "@/utils/types";

export default function ArticleBrowser() {
  const [query, setQuery] = useState<string>("");

  const [queriedArticles, setQueriedArticles] = useState<Array<ArticleClient>>(
    [],
  );
  const [queriedArticleCount, setQueriedArticleCount] = useState<number>(0);

  const [currentPage, setCurrentPage] = useState<number>(1);

  const take = 10;

  async function queryPrisma() {
    setQueriedArticles(
      await queryShopArticles(query, take, take * (currentPage - 1)),
    );
    setQueriedArticleCount(await queryShopArticleCount(query));
  }

  useEffect(() => {
    queryPrisma();
  }, [currentPage]);

  useEffect(() => {
    if (currentPage != 1) run();
    async function run() {
      setCurrentPage(1);
    }
    const timeout = setTimeout(async () => {
      queryPrisma();
    }, 500);

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className="w-full rounded-2xl bg-secondary text-background flex flex-col">
      <div className="flex items-stretch px-10 py-5 space-x-5">
        <div className="flex items-center">
          <h3 className="text-cm ">Artikelsuche</h3>
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
      <div className="p-5 bg-white/15 grow">
        {queriedArticles && (
          <ul>
            {queriedArticles.length > 0 ? (
              queriedArticles.map((article: ArticleClient) => {
                return <Article article={article} key={article.pzn} />;
              })
            ) : (
              <li key="li-no-results">Keine Ergebnisse</li>
            )}
          </ul>
        )}
      </div>
      <ArticlePagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        queriedArticleCount={queriedArticleCount}
      />
    </div>
  );
}
