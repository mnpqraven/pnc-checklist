import { DbDollContext, SaveContext } from "@/interfaces/payloads";
import { ReactNode, useContext, useEffect } from "react";
import { useLoadoutConfigs } from "./TableConfigs/Loadouts";
import { useStoreConfigs } from "./TableConfigs/Units";

interface Props {
  children: ReactNode;
}
const DbDollProvider = ({ children }: Props) => {
  // fetch clean db data

  const { setUnsaved } = useContext(SaveContext);
  const storeValues = useStoreConfigs();
  const loadoutValues = useLoadoutConfigs({
    unitId: storeValues.currentUnitId
  });

  useEffect(() => {
    setUnsaved(storeValues.dirtyUnits.length > 0 ||
    loadoutValues.dirtyLoadouts.length > 0
    );
  }, [setUnsaved, storeValues.dirtyUnits, loadoutValues.dirtyLoadouts]);

  return (
    <DbDollContext.Provider value={{ ...storeValues, ...loadoutValues }}>
      {children}
    </DbDollContext.Provider>
  );
};

export default DbDollProvider;
