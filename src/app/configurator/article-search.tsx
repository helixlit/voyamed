"use client"

import Search from "@/components/search";
import { queryShopArticles } from "@/utils/query";
import { Article } from "@/utils/types";
import { useEffect, useState } from "react";

type Props = {
  query: string;
  setQuery: (query: string) => void;

  articles: Array<Article>;
  setArticles: (articles: Array<Article>) => void;

  take: number;
  skip: number;
}

export default function ArticleSearch(props: Props) {
  const [selectedArticle, setSelectedArticle] = useState<Article>(null);

  return (
    <div className="absolute top-0 z-50 w-full flex flex-row items-start justify-left h-full text-foreground bg-background/80 rounded-full">
      <Search
        filteredItems={props.articles}
        query={props.query}
        setQuery={props.setQuery}
        selectedItem={selectedArticle}
        setSelectedItem={setSelectedArticle}
        placeholder="Suche nach Artikel..."
        divClassName="w-1/3 flex flex-col gap-2 pointer-events-auto w-full"
        inputClassName="py-1.5 px-4 focus:outline-0"
        ulClassName="z-50 rounded-[20px] py-2 px-4 bg-background/80 text-foreground/90 w-fit"
        liClassName=""
        selectedLiClassName=""
        queryPrisma={queryShopArticles}
      />
    </div>
  )
}