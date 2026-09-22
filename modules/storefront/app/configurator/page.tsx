import Browser from "./article-browser";
import Suitcase from "./suitcase";

export default function page() {
  return (
    <div className="mx-auto flex w-full max-w-360 flex-col gap-4 p-3 sm:p-5 xl:flex-row">
      <Suitcase />
      <Browser />
    </div>
  );
}
