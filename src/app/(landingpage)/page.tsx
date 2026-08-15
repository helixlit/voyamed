import Bundels from "./Bundels"
import FQA from "./FQA"
import Hero from "./hero"

function page() {
  return (
    <div className="overflow-x-hidden min-h-screen min-w-screen">
      <Hero />
      <FQA />
      <Bundels />
    </div >
  )
}

export default page