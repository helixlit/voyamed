import { Indication } from "@/utils/types"
import { Dispatch, SetStateAction } from "react";
import { kategorien } from "@/data/konfigurator/produkte.json";

interface Params {
  indications: Array<Indication>;
  setIndications: Dispatch<SetStateAction<Array<Indication>>>
}
export default function IndicationSelector(
  { indications, setIndications }: Params
) {
  const possibleIndications = Object.entries(kategorien);
  return (
    <section id="indication-selector">
      <ul className="flex flex-wrap gap-2">
        {possibleIndications.map(([key, value]) => {
          const selected = indications.includes(key as Indication);
          return (
            <button
              key={key}
              onClick={() => {
                if (selected) {
                  setIndications(
                    indications.filter(i => i !== key)
                  );
                } else {
                  setIndications([
                    ...indications,
                    key as Indication
                  ]);
                }
              }}
              className={`cursor-pointer rounded-full py-1 px-2 ${selected
                ? "bg-highlight"
                : "bg-tertiary"
                }`}
            >
              {value.name}
            </button>
          );
        })}
        <button
          className={`cursor-pointer rounded-full py-1 px-2 bg-foreground`}
          onClick={() => {
            setIndications([]);
          }}
        >Zurücksetzen</button>
      </ul>
    </section>
  )
}