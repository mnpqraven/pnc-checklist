import { DbDollContext, SaveContext } from "@/interfaces/payloads";
import { useStoreRefresh } from "@/utils/hooks/useStoreRefetch";
import { ReactNode, useContext, useEffect } from "react";
import { rspc } from "./ClientProviders";
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
  const refresh = useStoreRefresh();

  const saveUnitsMutation = rspc.useMutation(["saveUnits"]);
  function saveUnits() {
    saveUnitsMutation.mutate(storeValues.dirtyUnits, {
      onSuccess: () => refresh.refreshUnits(),
    });
  }

  useEffect(() => {
  console.warn('should see', storeValues.dirtyUnits)
  }, [storeValues.units]);


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
    slotValues.dirtySlots,
  ]);

  return (
    <DbDollContext.Provider
      value={{
        ...storeValues,
        ...loadoutValues,
        ...skillValues,
        ...algorithmValues,
        ...slotValues,
        saveUnits,
      }}
    >
      {children}
    </DbDollContext.Provider>
  );
};

export default DbDollProvider;
