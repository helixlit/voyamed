"use client";

import { createStripeProduct } from "@/lib/stripe/stripe";
import { addShopArticles, catalogDatabaseFreshSeed } from "@/utils/fetch-api";


export const dynamic = "force-dynamic";

export default function Page() {

  const handleSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    console.debug(formData);

    const file = formData.get('file');

    if (!(file instanceof File) || file.size === 0) {
      console.error("Please select a JSON file!");
      return;
    }

    try {
      const text = await file.text();
      const json = JSON.parse(text);

      const addShopArticlesResult = await addShopArticles(json);

      if (addShopArticlesResult.created >= 0) {
        console.log(`Succesfully added ${addShopArticlesResult.created}!`);
      }
      else console.log(`Error while trying to call catalog!`);

    } catch {
      console.error("Invalid JSON file.")
    }

  }


  return (
    <main className="grid grid-cols-2 p-2 gap-2">
      <div className="grid p-2 rounded-xl bg-highlight gap-2">
        <p className="">
          Add Shop Articles:
        </p>

        <form
          onSubmit={handleSubmit}
          className="grid gap-2 justify-items-center *:w-full *:rounded-xl *:p-2"
        >

          <label
            htmlFor="file"
            className="border-2 border-gray-500 hover:border-gray-100  border-dashed bg-background cursor-pointer text-center"
          >
            <p>
              Select a json file with Article PZNs...
            </p>
            <input
              id="file"
              type='file'
              name='file'
              accept='.json,application/json'
              className="sr-only"
            />
          </label>

          <button
            type='submit'
            className='cursor-pointer bg-secondary text-background'
          >
            Add PZNs to shop!
          </button>
        </form>
      </div>
      <div className="grid grid-cols-2 p-2 rounded-xl bg-secondary gap-2">
        <p className="col-span-1">
          Manage Stripe products:
        </p>
        <div className="grid p-2 gap-2 justify-items-center *:w-full col-span-2">
          <button
            className="rounded-xl cursor-pointer p-2 bg-tertiary text-background"
            onClick={() => {
              createStripeProduct("Test", "Test", 1000);
            }}
          >
            Create Stripe Products
          </button>
          <p>
          </p>
        </div>
      </div>

      <div className="rounded-xl bg-tertiary justify-items-center p-2 *:w-full">
        <button
          className="rounded-xl cursor-pointer p-2 bg-highlight hover:bg-highlight/80 transition-colors"
          onClick={() => {
            catalogDatabaseFreshSeed()
          }}
        >
          Reseed catalog database
        </button>
      </div>

    </main >
  )

}