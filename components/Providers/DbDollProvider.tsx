import { DbDollContext, SaveContext } from "@/interfaces/payloads";
import { AlgoPiece, Loadout, Slot, UnitSkill } from "@/src-tauri/bindings/rspc";
import { useStoreRefresh } from "@/utils/hooks/useStoreRefetch";
import { ReactNode, useContext, useEffect } from "react";
import { rspc } from "./ClientProviders";
import { useStoreConfigs } from "./TableConfigs/Units";
import { useGenericConfig } from "./TableConfigs/useGenericConfig";

interface Props {
  children: ReactNode;
}
const DbDollProvider = ({ children }: Props) => {
  const { setUnsaved } = useContext(SaveContext);
  const storeValues = useStoreConfigs();
  const refresh = useStoreRefresh();

  const loadout = useGenericConfig<Loadout>({
    storeApi: "loadoutByUnitId",
    constraint: "loadoutType",
  });
  const skill = useGenericConfig<UnitSkill>({
    storeApi: "skillLevelsByUnitIds",
    constraint: "loadoutId",
  });
  const algoPiece = useGenericConfig<AlgoPiece>({
    storeApi: "algoPiecesByLoadoutId",
    constraint: "loadoutId",
  });
  const slot = useGenericConfig<Slot>({
    storeApi: "slotsByAlgoPieceIds",
    constraint: "algoPieceId",
  });

  const saveUnitsMutation = rspc.useMutation(["saveUnits"]);
  function saveUnits() {
    saveUnitsMutation.mutate(storeValues.dirtyUnits, {
      onSuccess: () => refresh.refreshUnits(),
    });
  }

  const dirtyData = [
    loadout.dirtyData,
    skill.dirtyData,
    algoPiece.dirtyData,
    slot.dirtyData,
  ];

  // TODO: test after finishing refactoring
  useEffect(() => {
    setUnsaved(
      storeValues.dirtyUnits.length > 0 ||
        dirtyData.reduce((accu, current) => accu || current.length > 0, false)
    );
  }, [setUnsaved, storeValues.dirtyUnits, ...dirtyData]);
  // useEffect(() => {
  //   setUnsaved(
  //     storeValues.dirtyUnits.length > 0 ||
  //       loadout.dirtyData.length > 0 ||
  //       skill.dirtyData.length > 0 ||
  //       algoPiece.dirtyData.length > 0 ||
  //       slot.dirtyData.length > 0
  //   );
  // }, [
  //   setUnsaved,
  //   storeValues.dirtyUnits,
  //   loadout.dirtyData,
  //   skill.dirtyData,
  //   algoPiece.dirtyData,
  //   slot.dirtyData,
  // ]);

  return (
    <DbDollContext.Provider
      value={{
        ...storeValues,
        algoPiece,
        loadout,
        slot,
        skill,
        saveUnits,
      }}
    >
      {children}
    </DbDollContext.Provider>
  );
};

export default DbDollProvider;
