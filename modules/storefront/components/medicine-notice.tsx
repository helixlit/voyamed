/** Mandatory notice when advertising medicines (§ 4 Abs. 3 HWG) — keep it legible and set apart. */
export default function MedicineNotice({ className = "" }: { className?: string }) {
  return (
    <p className={`text-xs leading-relaxed ${className}`}>
      Zu Risiken und Nebenwirkungen lesen Sie die Packungsbeilage und fragen Sie Ihre Ärztin, Ihren Arzt oder in Ihrer Apotheke.
    </p>
  );
}
