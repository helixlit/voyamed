import Link from "next/link";

export default function ImpressumPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-12 sm:py-16">
      <p className="text-sm font-medium text-highlight">Rechtliches</p>
      <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">Impressum</h1>
      <div className="mt-8 grid gap-6 rounded-3xl bg-foreground/[0.045] p-5 text-foreground/80 sm:p-8">
        <section>
          <h2 className="text-lg font-semibold text-foreground">Angaben gemäß § 5 TMG</h2>
          <address className="mt-3 not-italic leading-7">
            Antonius-Apotheke<br />
            Inh. Anton Fink e.K.<br />
            Oberer Stadtplatz 19<br />
            94469 Deggendorf
          </address>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground">Kontakt</h2>
          <p className="mt-3 leading-7">Telefon: <a className="underline underline-offset-2" href="tel:+49991998910">0991 99 89 10</a><br />E-Mail: <a className="underline underline-offset-2" href="mailto:sekretariat@antoniusapotheke.de">sekretariat@antoniusapotheke.de</a></p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground">Berufsrechtliche Angaben</h2>
          <p className="mt-3 leading-7">Handelsregister: Amtsgericht Deggendorf, HRA 878<br />USt-IdNr.: DE 127705749<br />Zuständige Kammer: Landesapothekerkammer Bayern<br />Aufsichtsbehörde: Regierung von Niederbayern</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground">Verbraucherstreitbeilegung</h2>
          <p className="mt-3 leading-7">Die Antonius-Apotheke ist weder verpflichtet noch bereit, an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
        </section>
      </div>
      <p className="mt-6 text-sm text-foreground/65">Quelle und vollständige Angaben: <Link className="underline underline-offset-2" href="https://www.antoniusapotheke.de/impressum" target="_blank" rel="noreferrer">Impressum der Antonius-Apotheke</Link>.</p>
    </main>
  )
}
