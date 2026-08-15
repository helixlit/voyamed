import Browser from "./article-browser";
import Suitcase from "./suitcase";

export default function page() {
  return (
    <div className="grow flex flex-row w-full p-4 gap-4">
      <Suitcase />
      <Browser searchParams={null} />
    </div>
  )
}