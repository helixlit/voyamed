import { Activity, ClimateZone, CountryKit } from "@/utils/types";
import kits from "@/data/konfigurator/kits.json"
import { useEffect, useState } from "react";
import Article from "@/app/configurator/article";
import { getShopArticleByPZN } from "@/utils/fetch-api";
import { Article as T_Article } from "@voyamed/catalog/contract";
import { ShoppingCartBundle, useShoppingCartStore } from "@/lib/state/shopping-cart-state";

interface Props {
  country: CountryKit | null,
  activity: Activity | "",
  displayArticles: boolean,
}
export default function BundleDisplay(props: Props) {
  const [articles, setArticles] = useState<Array<T_Article>>([]);
  const { addBundle }
    = useShoppingCartStore((state) => state);

  useEffect(() => {
    const newPZNs: string[] = [];

    for (const pzn of kits.basis.produkte) {
      newPZNs.push(pzn);
    }

    if (props.country?.klimazone) {
      const climateZone: ClimateZone = props.country?.klimazone as ClimateZone;
      if (kits.klimazonen[climateZone]?.hinzufuegen)
        for (const pzn of kits.klimazonen[climateZone].hinzufuegen) {
          newPZNs.push(pzn);
        };
    }

    if (props.activity && kits.activities[props.activity].hinzufuegen) {
      for (const pzn of kits.activities[props.activity].hinzufuegen) {
        newPZNs.push(pzn);
      };
    }

    if (props.country?.hygiene_risiko === "hoch") {
      for (const pzn of kits.hygiene_hoch.hinzufuegen) {
        newPZNs.push(pzn);
      };
    }

    (async () => {
      const articles = [];
      for (const pzn of newPZNs) {
        articles.push((await getShopArticleByPZN(pzn)).article)
      }
      setArticles(articles);
      console.debug(articles);
    })()

  }, [props.activity, props.country])

  const addBundleToCart = () => {


    if (!props.country || !kits.activities || !props.activity) return;
    const name
      = `${props.country.name}-${kits.activities[props.activity].name}-Bundle`;

    const shoppingCartArticles = articles.map((a) => ({ article: a, quantity: 1 }));
    const bundle = new ShoppingCartBundle(name, 1, shoppingCartArticles);
    addBundle(bundle);

    console.debug(`Added bundle ${JSON.stringify(bundle)}`);
  };

  return (
    <section id="bundle-display" className="@container min-w-dvw  px-10">
      {props.country && props.activity ?
        <div className="grid content-center-safe">
          <h2 className="text-center"> {props.country.name}-{kits.activities[props.activity].name}-Bundle</h2>
          <div className="grid">
            <div className="text-center">
              <section>
                {props.country.name}: {kits.klimazonen[props.country.klimazone as ClimateZone].beschreibung}<br />
                {props.country.hygiene_risiko === "hoch" ?
                  <p>
                    Achtung: {kits.hygiene_hoch.beschreibung}<br />
                    Hygiene-Kit wurde deshalb hinzugefügt.
                  </p> : <p></p>
                }
              </section>
              <p>
                {kits.activities[props.activity].name}: {kits.activities[props.activity].beschreibung}
              </p>
            </div>
            <div className="min-w-30 justify-self-center p-3">
              <button
                onClick={addBundleToCart}
                className=" cursor-pointer rounded-full bg-secondary p-2"
              >
                In den Warenkorb
              </button>
            </div>
          </div>
          {props.displayArticles &&
            <ul
              className="grid gap-2 grid-flow-row grid-cols-1 @min-[650px]:grid-cols-2 @min-[1000px]:grid-cols-3 @min-[1500px]:grid-cols-4"
            >
              {articles.map(a => (
                <Article
                  article={a}
                  key={a.pzn}
                />
              ))}
            </ul>
          }
        </div>
        : <p className="text-foreground/70 text-center">
          Bitte wähle eine Land und Aktivität!
        </p>
      }
    </section >
  )
}