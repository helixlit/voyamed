"use client";

import Search from "@/components/search";
import { ArticleWithId } from "@/utils/types";
import { ShopArticle } from "@voyamed/catalog/contract";
import { useState } from "react";

type Props = {
  query: string;
  setQuery: (query: string) => void;

  articles: Array<ArticleWithId>;
  setArticles: (articles: Array<ArticleWithId>) => void;

  take: number;
  skip: number;

};

export default function ArticleSearch(props: Props) {
  const [selectedArticle, setSelectedArticle] = useState<ArticleWithId | null>(null);

  const queryPrisma = async (query: string) => {
    const articleResponse = await fetch(
      `/api/shop-articles?query=${encodeURIComponent(query)}&take=10`
    );
    const result: Array<ShopArticle> = await articleResponse.json();
    return result.map(sa => ({ id: sa.pzn, ...sa.article }));
  }

  return (
    <div className="w-full text-foreground">
      <Search<ArticleWithId>
        filteredItems={props.articles}
        query={props.query}
        setQuery={props.setQuery}
        selectedItem={selectedArticle}
        setSelectedItem={setSelectedArticle}
        placeholder="Suche nach Artikel..."
        divClassName="relative flex w-full flex-col gap-2"
        inputClassName="min-h-11 w-full rounded-full bg-background px-4 py-2 text-sm shadow-sm outline-none transition-shadow placeholder:text-foreground/45 focus:ring-2 focus:ring-highlight"
        ulClassName="absolute top-12 z-30 max-h-64 w-full overflow-y-auto rounded-2xl bg-background p-2 text-foreground shadow-xl"
        liClassName=""
        selectedLiClassName=""
        queryPrisma={queryPrisma}
      />
    </div>
  );
}
