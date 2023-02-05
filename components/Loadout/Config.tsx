import { LoadoutType } from "@/src-tauri/bindings/enums";
import { AlgoSet, Unit } from "@/src-tauri/bindings/structs";
import { DEFAULT_LEVEL } from "@/utils/defaults";
import { useState } from "react";
import { Updater } from "use-immer";

type Props = {
  unitHandler: Updater<Unit>;
  type: LoadoutType;
};
const LoadoutConfig = ({ type: loadout_type, unitHandler: setUnit }: Props) => {
  const [display, setDisplay] = useState(false);

  function fillAlgo(filled: boolean) {
    const cats = ["offense", "stability", "special"] as (keyof AlgoSet)[];
    setUnit((draft) => {
      cats.forEach((cat) => {
        draft[loadout_type].algo[cat].forEach((piece, index) => {
          piece.slot.forEach((_, indexslot) => {
            draft[loadout_type].algo[cat][index].slot[indexslot] = filled;
          });
        });
      });
      return draft;
    });
  }

  function updateLevel(to: number) {
    setUnit((draft) => {
      draft[loadout_type].level = to;
      return draft;
    });
  }

  function clearFrags() {
    setUnit((draft) => {
      draft[loadout_type].frags = 0;
      return draft;
    });
  }
  if (display)
    return (
      <>
        <button onClick={() => setDisplay(!display)}>toggle</button>
        <div className="flex flex-row">
          algorithm:
          <button onClick={() => fillAlgo(true)}>select all</button>
          <button onClick={() => fillAlgo(false)}>select none</button>
        </div>
        <div className="flex flex-row">
          level:
          {[DEFAULT_LEVEL, 60, 70].map((level, index) => (
            <button key={index} onClick={() => updateLevel(level)}>
              {level}
            </button>
          ))}
        </div>
        <div className="flex flex-row">
          <button onClick={clearFrags}>clear frags</button>
        </div>
      </>
    );
  return <button onClick={() => setDisplay(!display)}>toggle</button>;
};
export default LoadoutConfig;
