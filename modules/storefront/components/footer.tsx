import Link from "next/link"
import MedicineNotice from "@/components/medicine-notice"
import { pharmacy } from "@/lib/pharmacy"

export default function Footer() {
  return (
    <footer className="bg-prim px-6 pb-6 pt-10 text-sm text-foreground/80">
      <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-2 lg:grid-cols-[2fr_1.5fr_1fr]">
        <div>
          <p className="text-2xl font-medium text-foreground">Voya<span className="text-secondary">med</span></p>
          <p className="mt-2 max-w-sm">Deine Reiseapotheke passend zu Reiseziel und Aktivität – geprüft von der {pharmacy.name}.</p>
          <Link href="/globe" className="mt-4 inline-flex rounded-full bg-foreground px-5 py-2.5 font-medium text-background transition-all hover:-translate-y-0.5 hover:shadow-lg">Reiseapotheke zusammenstellen</Link>
        </div>
        <address className="not-italic leading-6">
          <p className="font-semibold text-foreground">Partnerapotheke</p>
          {pharmacy.name}<br />
          {pharmacy.street}<br />
          {pharmacy.city}<br />
          <a href={pharmacy.phoneHref} className="underline underline-offset-2">{pharmacy.phone}</a><br />
          <a href={`mailto:${pharmacy.email}`} className="underline underline-offset-2">{pharmacy.email}</a>
        </address>
        <nav aria-label="Rechtliches" className="flex flex-col gap-1.5">
          <p className="font-semibold text-foreground">Rechtliches</p>
          <Link href="/impressum" className="hover:underline">Impressum</Link>
          <Link href="/agb" className="hover:underline">AGB</Link>
        </nav>
      </div>
      <div className="mx-auto mt-8 max-w-6xl border-t border-foreground/20 pt-4">
        <MedicineNotice />
        <p className="mt-2 text-xs">© 2026 Voyamed</p>
      </div>
    </footer>
  )
}
