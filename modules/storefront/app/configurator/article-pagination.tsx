"use client";

type Props = {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  queriedArticleCount: number;
}

export default function ArticlePagination({ currentPage, setCurrentPage, queriedArticleCount }: Props) {
  const pages = Math.ceil(queriedArticleCount / 10);
  if (pages <= 1) return null;

  const start = Math.max(1, Math.min(currentPage - 2, pages - 4));
  const pageNumbers = Array.from({ length: Math.min(5, pages - start + 1) }, (_, index) => start + index);

  return (
    <section id="article-pagination">
      <nav aria-label="Artikel-Seiten" className="flex items-center justify-center gap-1 px-3 py-3 text-sm">
        <button
          type="button"
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Vorherige Seite"
          className="grid min-h-10 min-w-10 place-items-center rounded-full transition-colors hover:bg-background/15 disabled:cursor-not-allowed disabled:opacity-35"
        >
          ←
        </button>
        {start > 1 && <span className="px-1 text-background/70">…</span>}
        {pageNumbers.map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => setCurrentPage(page)}
            aria-current={page === currentPage ? "page" : undefined}
            className={`grid min-h-10 min-w-10 place-items-center rounded-full transition-all ${page === currentPage ? "bg-highlight font-semibold text-foreground shadow-sm" : "hover:bg-background/15"}`}
          >
            {page}
          </button>
        ))}
        {pageNumbers.at(-1) !== pages && <span className="px-1 text-background/70">…</span>}
        <button
          type="button"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === pages}
          aria-label="Nächste Seite"
          className="grid min-h-10 min-w-10 place-items-center rounded-full transition-colors hover:bg-background/15 disabled:cursor-not-allowed disabled:opacity-35"
        >
          →
        </button>
      </nav>
    </section>
  );
}
