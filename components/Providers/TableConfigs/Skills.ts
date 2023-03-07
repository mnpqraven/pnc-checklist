import { UnitSkill } from "@/src-tauri/bindings/rspc";
import { deep_eq } from "@/utils/helper";
import { useEffect } from "react";
import { useImmer } from "use-immer";
import { rspc } from "../ClientProviders";

export const useSkillConfigs = () => {
  const { data: storeData } = rspc.useQuery(["skillLevelsByUnitIds", null]);

  const [currentSkills, setCurrentSkills] = useImmer<UnitSkill[]>([]);
  const [dirtySkills, setDirtySkills] = useImmer<UnitSkill[]>([]);

  const [skillsOnTop, setSkillsOnTop] = useImmer<UnitSkill[]>([]);

  useEffect(() => {
    if (storeData) {
      console.warn('storeData skill changed')
      setSkillsOnTop((draft) => {
        let beforeIds = draft.map((e) => e.id);
        let nextIds = storeData.map((e) => e.id);
        // https://stackoverflow.com/questions/1187518/how-to-get-the-difference-between-two-arrays-in-javascript
        const intersecOrDiff = nextIds.length > draft.length;
        let diff = nextIds.filter((e) =>
          intersecOrDiff ? !beforeIds.includes(e) : beforeIds.includes(e)
        );
        if (intersecOrDiff)
          storeData
            .filter((e) => diff.includes(e.id))
            .forEach((unit) => draft.push(unit));
        else draft = draft.filter(e => diff.includes(e.id))
        // intesect > push, diff > splice
        return draft;
      });
    }
  }, [storeData]);

  useEffect(() => {
    // console.warn("dirtyskills");
    if (storeData) {
      let dirtyList = storeData.map((unit) => {
        if (dirtySkills.map((e) => e.id).includes(unit.id))
          return dirtySkills.find((e) => e.id == unit.id)!;
        return unit;
      });

      setSkillsOnTop((draft) => {
        draft = dirtyList;
        return draft;
      });
    }
    // console.warn(dirtySkills);
  }, [dirtySkills]);

  function updateSkill(to: UnitSkill, loadoutId: string) {
    if (!storeData) throw new Error("should be defined here already");

    let bucketIndex: number = dirtySkills.findIndex((e) => e.id == to.id);

    if (bucketIndex === -1) {
      // adding
      setDirtySkills((draft) => {
        draft.push(to);
        return draft;
      });
    } else if (deep_eq(storeData[storeData.findIndex((e) => e.id == to.id)], to)) {
      // removing
      setDirtySkills((draft) => {
        draft.splice(bucketIndex, 1);
        return draft;
      });
    } else {
      setDirtySkills((draft) => {
        draft[draft.findIndex((e) => e.id == to.id)] = to;
        return draft;
      });
    }

    setCurrentSkills((draft) => {
      draft[draft.findIndex((e) => e.loadoutId == loadoutId)] = to;
      return draft;
    });
  }

  return { skills: skillsOnTop,dirtySkills, currentSkills, updateSkill };
};
