"use client";

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { bundles } from "@/utils/Bundles";

export default function Bundels() {
  const [showMore, setShowMore] = useState<boolean[]>([]);
  const [complex, setComplex] = useState<boolean[]>([]);

  const toggleShowMore = (index: number) => {
    setShowMore(prev =>
      prev.map((value, i) =>
        i === index ? !value : value
      )
    );
  };

  const toggleComplex = (index: number, b: boolean) => {
    setComplex(prev =>
      prev.map((value, i) =>
        i === index ? b : value
      )
    );
  };

  useEffect(() => {
    setShowMore(Array(bundles.length).fill(false));
    setComplex(Array(bundles.length).fill(false));
  }, [bundles]);
  return (
    <section className="w-full flex flex-col items-center align-middle py-10 px-10">
      <h1 className="text-3xl">Schnell startklar mit unseren Bundels</h1>
      <h3 className="text-cs text-foreground/80 py-5">Vorkonfiguriert für die häufigsten Reisetypen — oder stell dir deinen Koffer selbst zusammen.</h3>
      <div className="flex flex-wrap gap-5 justify-center items-start">
        {bundles.map((b, i) => {
          const parent = useRef<HTMLDivElement>(null);
          const child = useRef<HTMLDivElement>(null);
          return (
            <div key={b.name} className="flex flex-col items-center rounded-2xl border-2 border-foreground/50 overflow-hidden min-w-80 w-[calc(20rem+5vw)] max-w-150"
            >
              <Image
                width={700}
                height={700}
                src={b.img}
                alt=""
                className="h-60"
              />
              <div className="px-4 pt-2 group">
                <div className="pb-2">
                  <h2 className="text-cs text-foreground/80">{b.name}</h2>
                  <p className="text-cxs text-foreground/70 pb-2">{b.beschreibung}
                    <button
                      onClick={() => {
                        toggleShowMore(i);
                        if (!child.current || !parent.current) return;
                        parent.current.style.maxHeight =
                          !showMore[i] ? `${child.current.scrollHeight}px` : `0px`;
                      }}
                      className="pl-2 underline cursor-pointer text-highlight"
                    >{!showMore[i] ? "Mehr..." : "Weniger"}</button>
                  </p>
                </div>
                <div ref={parent} className="max-h-0 transition-all duration-300 ease-in-out">
                  < div
                    ref={child}
                  >
                    <div className="flex flex-row gap-4 bg-foreground/15 p-2 rounded-2xl select-none">
                      <label htmlFor={`${b.name}+simpleBtn`} className="group w-1/2 cursor-pointer">
                        <input
                          type="radio"
                          id={`${b.name}+simpleBtn`}
                          name={b.name}
                          className="hidden peer"
                          defaultChecked
                          onClick={() => toggleComplex(i, false)}
                        />
                        <p className="h-full text-cxs text-center text-background bg-foreground/80 rounded-xl peer-checked:bg-highlight/80 flex items-center justify-center">Einfach</p>

                      </label>
                      <label htmlFor={`${b.name}+complexBtn`} className="w-1/2 cursor-pointer">
                        <input
                          type="radio"
                          id={`${b.name}+complexBtn`}
                          name={b.name}
                          className="hidden peer"
                          onClick={() => {
                            toggleComplex(i, true)
                          }}
                        />
                        <p className="h-full text-cxs text-center text-background bg-foreground/80 rounded-xl peer-checked:bg-highlight/80 flex items-center justify-center">Produktname & PZN</p>
                      </label>
                    </div>
                    <p className="pb-2 pt-4 text-cs">
                      Enthaltene Produkte:
                    </p>
                    {!complex[i] &&
                      <ul className="list-disc pl-6 pb-4 marker:text-highlight">
                        {b.medikamente.map((m) => {
                          return (
                            <li key={m} className="text-cxs text-foreground/80">{m}</li>
                          )
                        }
                        )}
                      </ul>
                    }
                    {complex[i] &&
                      <ul className="list-disc pl-6 pb-4 marker:text-highlight">
                        {b.medikamente.map((m) => {
                          return (
                            <li key={m} className="text-cxs text-foreground/80">{m}</li>
                          )
                        }
                        )}
                      </ul>
                    }
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section >
  )
}