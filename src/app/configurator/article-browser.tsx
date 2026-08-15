"use client"

import ArticleSearch from "./article-search"
import { use, useEffect, useState } from "react"
import { queryShopArticleCount, queryShopArticles } from "@/utils/query"
import ArticlePagination from "./article-pagination"
import { Article } from "@/utils/types"

type Props = {
  searchParams: Promise<{
    page?: string
    search?: string
    category?: string
    sort?: string
  }>
}

export default function ArticleBrowser({ searchParams }: Props) {
  const [query, setQuery] = useState<string>("");

  const [queriedArticles, setQueriedArticles] = useState<Array<Article>>([]);
  const [queriedArticleCount, setQueriedArticleCount] = useState<number>(0);

  const [currentPage, setCurrentPage] = useState<number>(1);

  const take = 10;

  useEffect(() => {
    async function queryPrisma() {
      setQueriedArticles((await queryShopArticles(
        query, take, take * (currentPage - 1)))
        .map(article => ({
          ...article,
          id: article.pzn,
        })));
      setQueriedArticleCount(await queryShopArticleCount(query));
    }
    queryPrisma();
  }, [query, currentPage])

  useEffect(() => {
    setCurrentPage(1);
  }, [query])

  return (
    <div className="w-full rounded-2xl bg-secondary text-background flex flex-col">
      <div className="flex items-stretch px-10 py-5 space-x-5">
        <h3 className="text-cm ">Artikelsuche</h3>
        <div className=" relative w-full">
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
              queriedArticles.map((item, index) => {
                return (
                  <li key={item.pzn}>
                    {item.name}
                  </li>
                )
              })
            ) : (
              <li key='li-no-results'>Keine Ergebnisse</li>
            )}
          </ul>
        )}
      </div>
      <ArticlePagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        queriedArticleCount={queriedArticleCount}
      />
    </div >
  )
}