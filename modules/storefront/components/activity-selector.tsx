import { Activity } from "@/utils/types"
import kits from "@/data/konfigurator/kits.json";
import React from "react";

interface Props {
  selectedActivity: Activity | "",
  setSelectedActivity: React.Dispatch<React.SetStateAction<Activity | "">>,
  availableActivities?: Activity[],
};
export default function ActivitySelector(props: Props) {
  const available: Activity[] = props.availableActivities ?? (Object.keys(kits.activities) as Activity[]);
  return (
    <section
      id="activity-selector"
      className="flex w-full min-w-0 flex-col gap-1 rounded-2xl bg-prim px-4 py-2 text-foreground sm:w-auto sm:flex-row sm:items-center sm:rounded-full"
    >
      <label htmlFor="activities" className="text-sm font-medium">Aktivität</label>
      <select
        name="activities"
        id="activities"
        value={props.selectedActivity}
        onChange={(e) => {
          props.setSelectedActivity(e.target.value as Activity)
        }}
        disabled={props.availableActivities !== undefined && available.length === 0}
        className="min-w-0 bg-transparent text-left text-sm outline-none sm:text-right"
      >
        <option value="" key="">
          {available.length ? "Bitte wählen" : "Zuerst ein Land wählen"}
        </option>
        {available.map((key) => {
          const activity = kits.activities[key];
          return (
          <option value={key} key={key}>
            {activity.name}
          </option>
          );
        })}
      </select>
    </section >
  )
}
