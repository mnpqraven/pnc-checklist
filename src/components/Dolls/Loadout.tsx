import { For } from "solid-js";

const DollLoadoutContainer = () => {
  const loadout_types = ["Current", "Goal"];
  return <For each={loadout_types}>{(type) => <p>{type}</p>}</For>;
};
export default DollLoadoutContainer;
