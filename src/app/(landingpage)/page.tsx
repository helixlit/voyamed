import Bundels from "./Bundels"
import FQA from "./FQA"
import Hero from "./Hero"

function page() {
  return (
    <div className="overflow-x-hidden min-h-screen">
      <Hero />
      <FQA />
      <Bundels />
    </div >
  )
}

export default page