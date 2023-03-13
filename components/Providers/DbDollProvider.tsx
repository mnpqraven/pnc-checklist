import { DbDollContext, SaveContext } from "@/interfaces/payloads";
import {
  AlgoPiece,
  Loadout,
  LoadoutType,
  Slot,
  UnitSkill,
} from "@/src-tauri/bindings/rspc";
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

  function algoFillSlot(loadoutId: string, allOrNone: boolean) {
    console.warn("algopiece", algoPiece.currentData);
    console.warn("slot", slot.currentData);
    console.warn("loadout", loadout.currentData);
  }

  function undoChanges(
    unitId: string,
    loadoutType: LoadoutType,
    undoType: "LOADOUT" | "UNIT"
  ) {
    switch (undoType) {
      case "LOADOUT": {
        const find = loadout.store?.find(
          (e) => e.unitId == unitId && e.loadoutType == loadoutType
        );
        if (find) loadout.updateData(find, loadoutType);
        break;
      }
      case "UNIT": {
        const filter = loadout.store?.filter((e) => e.unitId == unitId);
        filter?.forEach((lo) => loadout.updateData(lo, lo.loadoutType));
        break;
      }
      default:
        break;
    }
  }

  const dirtyData = [
    loadout.dirtyData,
    skill.dirtyData,
    algoPiece.dirtyData,
    slot.dirtyData,
  ];

  useEffect(() => {
    setUnsaved(
      storeValues.dirtyUnits.length > 0 ||
        dirtyData.reduce((accu, current) => accu || current.length > 0, false)
    );
  }, [setUnsaved, storeValues.dirtyUnits, ...dirtyData]);

  return (
    <DbDollContext.Provider
      value={{
        ...storeValues,
        algoPiece,
        loadout,
        slot,
        skill,
        saveUnits,
        algoFillSlot,
        undoChanges,
      }}
    >
      {children}
    </DbDollContext.Provider>
  );
};

export default DbDollProvider;
