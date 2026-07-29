import Browser from "./Browser";
import Suitcase from "./Suitcase";

export default function page() {
  return (
    <div className="flex flex-row w-full p-4 gap-4">
      <Suitcase />
      <Browser />
    </div>
  )
}