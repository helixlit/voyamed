import Link from "next/link"
export default function Footer() {
  return (
    <footer className="flex p-6 bg-prim text-background/50 text-cs">
      <div className="flex justify-between w-full border-t pt-2 text-foreground/70">
        <span>© 2026 Voyamed</span>
        <div className="flex gap-4">
          <Link href="/impressum">Impressum</Link>
          <Link href="/agb">AGB</Link>
        </div>
      </div>
    </footer>
  )
}