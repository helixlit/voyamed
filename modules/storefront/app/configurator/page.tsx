import Browser from "./article-browser";
import Suitcase from "./suitcase";

export default function page() {
  return (
    <div className="flex flex-row max-[1000px]:flex-col w-full p-4 gap-4">
      <Suitcase />
      <Browser />
    </div>
  );
}
