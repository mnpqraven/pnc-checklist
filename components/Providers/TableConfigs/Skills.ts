import { UnitSkill } from "@/src-tauri/bindings/rspc";
import { useEffect } from "react";
import { useImmerReducer } from "use-immer";
import { rspc } from "../ClientProviders";
import {
  CurrentActionables,
  currentReducer,
  DirtyListActionables,
  dirtyListReducer,
  DirtyOnTopActionables,
  dirtyOnTopReducer,
} from "./configReducers";

export const useSkillConfigs = () => {
  const { data: store } = rspc.useQuery(["skillLevelsByUnitIds", null]);

  const [currentList, dispatchList] = useImmerReducer<
    UnitSkill[],
    CurrentActionables<UnitSkill, "loadoutId">
  >(currentReducer, []);
  const [dirtyOnTop, dispatchDirtyOnTop] = useImmerReducer<
    UnitSkill[],
    DirtyOnTopActionables<UnitSkill>
  >(dirtyOnTopReducer, []);
  const [dirtyList, dispatchDirtyList] = useImmerReducer<
    UnitSkill[],
    DirtyListActionables<UnitSkill>
  >(dirtyListReducer, []);

  useEffect(() => {
    if (store) {
      dispatchDirtyList({ name: "CLEAR", store });
      dispatchDirtyOnTop({ name: "CONFORM_WITH_STORE", store });
    }
  }, [store]);

  useEffect(() => {
    if (store) dispatchDirtyOnTop({ name: "SET", store, dirties: dirtyList });
  }, [dirtyList]);

  function updateSkill(to: UnitSkill, loadoutId: string) {
    if (!store) throw new Error("should be defined here already");
    dispatchDirtyList({ name: "UPDATE", store, to });
    dispatchList({
      name: "UPDATE",
      to,
      constrain: "loadoutId",
      equals: loadoutId,
    });
  }

  return {
    skills: dirtyOnTop,
    dirtySkills: dirtyList,
    currentSkills: currentList,
    updateSkill,
  };
};
