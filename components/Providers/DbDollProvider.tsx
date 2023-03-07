import { DbDollContext, SaveContext } from "@/interfaces/payloads";
import { ReactNode, useContext, useEffect } from "react";
import useAlgorithmConfigs from "./TableConfigs/Algorithms";
import { useLoadoutConfigs } from "./TableConfigs/Loadouts";
import { useSkillConfigs } from "./TableConfigs/Skills";
import useSlotConfigs from "./TableConfigs/Slots";
import { useStoreConfigs } from "./TableConfigs/Units";

interface Props {
  children: ReactNode;
}
const DbDollProvider = ({ children }: Props) => {
  const { setUnsaved } = useContext(SaveContext);
  const storeValues = useStoreConfigs();
  const loadoutValues = useLoadoutConfigs();
  const skillValues = useSkillConfigs();
  const algorithmValues = useAlgorithmConfigs();
  const slotValues = useSlotConfigs();

  useEffect(() => {
    setUnsaved(
      storeValues.dirtyUnits.length > 0 ||
        loadoutValues.dirtyLoadouts.length > 0 ||
        skillValues.dirtySkills.length > 0 ||
        algorithmValues.dirtyPieces.length > 0 ||
        slotValues.dirtySlots.length > 0
    );
  }, [
    setUnsaved,
    storeValues.dirtyUnits,
    loadoutValues.dirtyLoadouts,
    skillValues.dirtySkills,
    algorithmValues.dirtyPieces,
    slotValues.dirtySlots
  ]);

  return (
    <DbDollContext.Provider
      value={{
        ...storeValues,
        ...loadoutValues,
        ...skillValues,
        ...algorithmValues,
        ...slotValues,
      }}
    >
      {children}
    </DbDollContext.Provider>
  );
};

export default DbDollProvider;
