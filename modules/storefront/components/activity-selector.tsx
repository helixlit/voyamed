import { Activity } from "@/utils/types"
import kits from "../data/konfigurator/kits.json";
import React from "react";

interface Props {
  selectedActivity: Activity | "",
  setSelectedActivity: React.Dispatch<React.SetStateAction<Activity | "">>,
};
export default function ActivitySelector(props: Props) {
  return (
    <section
      id="activity-selector"
      className="bg-prim rounded-full p-1 w-fit flex text-nowrap items-center px-3 gap-2 text-foreground"
    >
      <label htmlFor="activities">Wähle eine Aktivität:</label>
      <select
        name="activities"
        id="activities"
        value={props.selectedActivity}
        onChange={(e) => {
          props.setSelectedActivity(e.target.value as Activity)
        }}
        className="text-right max-w-fit"
      >
        <option value="" key="">
          Bitte wähle eine Aktivität
        </option>
        {Object.entries(kits.activities).map(([key, activity]) => (
          <option value={key} key={key}>
            {activity.name}
          </option>
        ))}
      </select>
    </section >
  )
}