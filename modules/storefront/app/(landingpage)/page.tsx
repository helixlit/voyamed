import BundleBrowser from "./(bundles)/bundle-browser"
import FQA from "./FQA"
import Hero from "./hero"

function page() {
  return (
    <div className="overflow-x-hidden min-h-screen min-w-screen">
      <Hero />
      <BundleBrowser />
      <FQA />
    </div >
  )
}

export default page
