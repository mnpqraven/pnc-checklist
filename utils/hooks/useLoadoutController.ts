import { LoadoutType, NeuralExpansion } from "@/src-tauri/bindings/enums";
import { Unit } from "@/src-tauri/bindings/structs";
import { ChangeEvent } from "react";
import { Updater } from "use-immer";

const SKILL_TYPE = { passive: "passive", auto: "auto" };
type SkillType = keyof typeof SKILL_TYPE;

const useLoadoutController = (setUnit: Updater<Unit>, type: LoadoutType) => {
  function slv(e: ChangeEvent<HTMLInputElement>, skill_type: SkillType) {
    setUnit((draft) => {
      if (draft) draft[type].skill_level[skill_type] = +e.target.value;
    });
  }

  function level(e: ChangeEvent<HTMLInputElement>) {
    setUnit((draft) => {
      if (draft) draft[type].level = +e.target.value;
    });
  }

  function frags(e: ChangeEvent<HTMLInputElement>) {
    setUnit((draft) => {
      if (draft) draft[type].frags = +e.target.value;
    });
  }

  function rarity(e: string) {
    setUnit((draft) => {
      if (draft) draft[type].neural = e as NeuralExpansion;
    });
  }

  return { slv, level, frags, rarity };
};

export default useLoadoutController;
