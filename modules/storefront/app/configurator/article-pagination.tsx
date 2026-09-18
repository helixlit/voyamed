"use client"

type Props = {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  queriedArticleCount: number;
}

export default function ArticlePagination(props: Props) {
  const pages = Math.ceil(props.queriedArticleCount / 10);

  console.debug(props.queriedArticleCount);
  console.debug(pages);

  const incrementPage = () => {
    if (pages <= props.currentPage) return;
    props.setCurrentPage(props.currentPage + 1)
  }

  const decrementPage = () => {
    if (props.currentPage <= 1) return;
    props.setCurrentPage(props.currentPage - 1)
  }

  const setPage = (i: number) => {
    if (i < 0 || i > pages) return;
    props.setCurrentPage(i + 1);
  }


  return (
    <div className="flex items-center justify-center p-1 text-cs">
      <button className=" cursor-pointer" onClick={decrementPage}>
        <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="var(--background)"><path d="m414.67-480.67 170 170q9.66 9.67 9.33 23.34-.33 13.66-10 23.33-9.67 9.67-23.67 9.67-14 0-23.66-9.67L343.33-457.33q-5.33-5.34-7.5-11-2.16-5.67-2.16-12.34 0-6.66 2.16-12.33 2.17-5.67 7.5-11l194-194q9.67-9.67 23.67-9.67 14 0 23.67 9.67 9.66 9.67 9.66 23.67 0 14-9.66 23.66l-170 170Z" /></svg>
      </button>
      <ul className="flex gap-2">
        {Array.from({ length: pages }, (_, i) => (
          i + 1 == props.currentPage ?
            <li key={i} className="text-highlight">
              {i + 1}
            </li> :
            <li key={i}>
              <button className="cursor-pointer" onClick={() => setPage(i)}>{i + 1}</button>
            </li>
        ))}
      </ul>

      <button className=" cursor-pointer" onClick={incrementPage}>
        < svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="var(--background)" > <path d="m521.33-480.67-170-170q-9.66-9.66-9.33-23.33.33-13.67 10-23.33 9.67-9.67 23.67-9.67 14 0 23.66 9.67L592.67-504q5.33 5.33 7.5 11 2.16 5.67 2.16 12.33 0 6.67-2.16 12.34-2.17 5.66-7.5 11l-194 194q-9.67 9.66-23.34 9.33-13.66-.33-23.33-10-9.67-9.67-9.67-23.67 0-14 9.67-23.66l169.33-169.34Z" /></svg>
      </button>
    </div >
  )
}