import { LoadoutType, NeuralExpansion } from "@/src-tauri/bindings/enums";
import { Unit } from "@/src-tauri/bindings/structs";
import { ChangeEvent } from "react";
import { Updater } from "use-immer";

const SKILL_TYPE = { passive: "passive", auto: "auto" };
type SkillType = keyof typeof SKILL_TYPE;

const useLoadoutController = (
  setUnit: Updater<Unit> | undefined,
  type: LoadoutType
) => {
  function slv(
    e: ChangeEvent<HTMLInputElement> | number,
    skill_type: SkillType
  ) {
    if (setUnit) {
      let val = 0;
      if (typeof e === "number") {
        val = e;
      } else val = +e.target.value;
      setUnit((draft) => {
        if (draft) draft[type].skill_level[skill_type] = val;
      });
    }
  }

  function level(e: ChangeEvent<HTMLInputElement>) {
    if (setUnit)
      setUnit((draft) => {
        if (draft) draft[type].level = +e.target.value;
      });
  }

  function frags(e: ChangeEvent<HTMLInputElement>) {
    if (setUnit)
      setUnit((draft) => {
        if (draft) draft[type].frags = +e.target.value;
      });
  }

  function rarity(e: string) {
    if (setUnit)
      setUnit((draft) => {
        if (draft) draft[type].neural = e as NeuralExpansion;
      });
  }

  return { slv, level, frags, rarity };
};

export default useLoadoutController;
