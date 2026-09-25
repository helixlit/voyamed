import BundleBrowser from "./(bundles)/bundle-browser"
import CheckoutNotice from "@/components/checkout-notice"
import FQA from "./FQA"
import Hero from "./hero"
import TrustBar from "@/components/trust-bar"
import HowItWorks from "@/components/how-it-works"

function page() {
  return (
    <div className="overflow-x-hidden min-h-screen min-w-screen">
      <CheckoutNotice />
      <Hero />
      <TrustBar />
      <HowItWorks />
      <BundleBrowser />
      <FQA />
    </div >
  )
}

export default page
