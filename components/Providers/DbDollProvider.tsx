import { DbDollContext, SaveContext } from "@/interfaces/payloads";
import { ReactNode, useContext, useEffect } from "react";
import { useLoadoutConfigs } from "./TableConfigs/Loadouts";
import { useSkillConfigs } from "./TableConfigs/Skills";
import { useStoreConfigs } from "./TableConfigs/Units";

interface Props {
  children: ReactNode;
}
const DbDollProvider = ({ children }: Props) => {
  const { setUnsaved } = useContext(SaveContext);
  const storeValues = useStoreConfigs();
  const loadoutValues = useLoadoutConfigs(storeValues.currentUnitId);
  const skillValues = useSkillConfigs();

  useEffect(() => {
    setUnsaved(
      storeValues.dirtyUnits.length > 0 ||
        loadoutValues.dirtyLoadouts.length > 0 ||
        skillValues.dirtySkills.length > 0
    );
  }, [
    setUnsaved,
    storeValues.dirtyUnits,
    loadoutValues.dirtyLoadouts,
    skillValues.dirtySkills,
  ]);

  return (
    <DbDollContext.Provider
      value={{ ...storeValues, ...loadoutValues, ...skillValues }}
    >
      {children}
    </DbDollContext.Provider>
  );
};

export default DbDollProvider;
