"use client";

import { useEffect, useRef } from "react";

const questions = [
  {
    "question": "Was unterscheidet eure Reiseapotheken von einer herkömmlichen Zusammenstellung aus der Drogerie?",
    "answer": "Während Drogerien nur frei verkäufliche Produkte ohne medizinische Beratung führen, bieten wir kuratierte Sets an, die auf wissenschaftlichen Standards der Reisemedizin basieren. Wir kombinieren sinnvolle Präparate gegen Infektionen, Schmerzen und Verdauungsprobleme mit einer fachlichen Anleitung."
  },
  {
    "question": "Wie lange sind die Produkte in meinem Set haltbar?",
    "answer": "Wir garantieren eine Mindesthaltbarkeit von mindestens 12 Monaten ab dem Versanddatum. Falls ein Produkt eine kürzere Restlaufzeit haben sollte, informieren wir dich vor dem Versand persönlich."
  },
  {
    "question": "Sind alle enthaltenen Medikamente für Kinder geeignet?",
    "answer": "Unsere Basis-Sets sind primär für Erwachsene zusammengestellt. Wir bieten jedoch spezielle 'Family-Editions' an, die kindgerechte Dosierungen (z. B. Säfte statt Tabletten) enthalten. Bitte achte bei der Auswahl deines Sets auf die entsprechende Kennzeichnung."
  },
  {
    "question": "Was sollte ich tun, wenn ich eine Vorerkrankung habe?",
    "answer": "Menschen mit chronischen Erkrankungen sollten vor Reiseantritt zwingend Rücksprache mit ihrem behandelnden Arzt halten. Unsere Sets sind für die Selbstmedikation von typischen Reisebeschwerden konzipiert, können aber eine individuelle ärztliche Therapie nicht ersetzen."
  },
  {
    "question": "Kann ich die Apotheke auch für Geschäftsreisen nutzen?",
    "answer": "Absolut. Unsere kompakten Sets sind ideal für Geschäftsreisende, die wenig Platz im Handgepäck haben, aber dennoch auf alle Eventualitäten vorbereitet sein wollen. Die Rechnung ist zudem ideal für deine Spesenabrechnung geeignet."
  },
  {
    "question": "Wie sicher ist der Versand von Arzneimitteln?",
    "answer": "Wir nutzen ausschließlich zertifizierte Versandmethoden. Jedes Paket wird fachgerecht verpackt, um Temperaturschwankungen und Erschütterungen während des Transports zu minimieren. Zudem wird jede Sendung lückenlos verfolgt."
  },
  {
    "question": "Darf ich die Medikamente im Flugzeug mitführen?",
    "answer": "Ja, in den üblichen Mengen für den persönlichen Bedarf ist dies problemlos möglich. Wir empfehlen jedoch, die Reiseapotheke immer im Handgepäck zu verstauen, falls der Koffer verloren geht. Bei flüssigen Medikamenten über 100 ml solltest du zudem das ärztliche Attest bereithalten, das bei vielen unserer Sets enthalten ist."
  },
  {
    "question": "Was mache ich, wenn ein Medikament im Ausland nicht mehr ausreicht?",
    "answer": "Unsere Sets enthalten eine Patientenbroschüre mit englischen Fachbegriffen für alle enthaltenen Wirkstoffe. Damit kannst du bei einem Arzt vor Ort oder in einer lokalen Apotheke präzise kommunizieren, was du bereits eingenommen hast und was du als Ersatz benötigst."
  },
  {
    "question": "Warum ist die Reiseapotheke nicht günstiger?",
    "answer": "Der Preis setzt sich aus der hohen Qualität der Markenpräparate, der fachlichen Expertise eines approbierten Apothekers bei der Zusammenstellung sowie der sicheren, gesetzeskonformen Lagerung und Logistik zusammen. Sicherheit bei Gesundheitsprodukten sollte keine Kompromisse zulassen."
  },
  {
    "question": "Erhalte ich Unterstützung bei der Auswahl meines Zielgebiets?",
    "answer": "Ja! Wir haben unsere Sets nach Regionen optimiert (z. B. Tropen, Hochgebirge, Europa). Wenn du dir dennoch unsicher bist, findest du in unserem Blog einen interaktiven Ratgeber oder kannst uns direkt über unseren Support kontaktieren."
  },
  {
    "question": "Kann ich meine Bestellung stornieren?",
    "answer": "Eine Stornierung ist möglich, solange das Paket noch nicht versandt wurde. Da wir als Apotheke unter strengen Sicherheitsvorgaben arbeiten, sind Arzneimittel nach Versand aus hygienischen Gründen vom Rückgaberecht ausgeschlossen."
  },
  {
    "question": "Wie sieht es mit dem Datenschutz bei meiner Bestellung aus?",
    "answer": "Deine Gesundheitsdaten sind bei uns sicher. Wir verarbeiten deine Informationen gemäß den strengsten Datenschutzbestimmungen (DSGVO). Wir speichern nur die Daten, die für die Abwicklung deiner Bestellung zwingend erforderlich sind."
  }
]

export default function FQA() {
  return (
    <section className="w-full py-4 select-none">
      <h2 className="text-center text-cl">Häufig gestellte Fragen</h2>
      <h3 className="text-cs text-center pb-5 text-foreground/80">Hier findest du Antworten auf deine Fragen</h3>
      <ul className="px-10 max-w-full">
        {questions.map((q, i) => {
          const input = useRef<HTMLInputElement>(null);
          const p = useRef<HTMLParagraphElement>(null);
          const pQ = useRef<HTMLParagraphElement>(null);
          const div = useRef<HTMLDivElement>(null);
          const label = useRef<HTMLLabelElement>(null);
          return (
            <div
              key={q.question}
              className="p-3 first:border-t border-b border-foreground/80 max-h-auto overflow-hidden w-200 m-auto relative"
            >

              <label
                htmlFor={q.question}
                ref={label}
                className={`group px-1 select-none w-full cursor-pointer flex  flex-col relative`}
              >
                <input
                  ref={input}
                  type="checkbox"
                  id={q.question}
                  className="peer hidden"
                  onClick={() => {
                    if (!div.current || !input.current) return;
                    div.current.style.maxHeight = input.current.checked ? `${p.current?.scrollHeight}px` : `0px`;
                  }}
                />
                <div className="flex flex-row justify-between align-middle itmes-center w-full hover:text-highlight">
                  <p ref={pQ} className="text-cs">{q.question}</p>
                  <span className="relative w-5 h-5">
                    <span
                      className={`
      absolute left-1/2 top-1/2 h-0.5 w-5 bg-current
      translate-y-2.25 -translate-x-3.5
      transition-transform duration-300
      rotate-0 group-has-checked:rotate-135
    `}
                    />

                    <span
                      className={`
      absolute left-1/2 top-1/2 h-5 w-0.5 bg-current -translate-x-1.25
      transition-transform duration-300 group-has-checked:rotate-135
    `}
                    />
                  </span>
                </div>
                <div ref={div} className="max-h-0 transition-all duration-300">
                  <p
                    ref={p}
                    className="w-full text-left pt-3 select-text transition-all duration-300 text-cxs text-foreground/80 cursor-text z-100">
                    {q.answer}
                  </p>
                </div>


              </label>

            </div>

          );
        }
        )
        }
      </ul>
    </section>
  )
}