import {
  DbDollContext,
  SaveContext,
  ToastContext,
} from "@/interfaces/payloads";
import {
  AlgoPiece,
  Loadout,
  LoadoutType,
  Slot,
  UnitSkill,
} from "@/src-tauri/bindings/rspc";
import { useStoreRefresh } from "@/utils/hooks/useStoreRefetch";
import { SUCCESS, TOAST_SAVE_CONTENT_OK } from "@/utils/lang";
import { ReactNode, useContext, useEffect, useMemo } from "react";
import { rspc } from "./ClientProviders";
import { useStoreConfigs } from "./TableConfigs/Units";
import { useGenericConfig } from "./TableConfigs/useGenericConfig";

interface Props {
  children: ReactNode;
}
const DbDollProvider = ({ children }: Props) => {
  const { fireToast } = useContext(ToastContext);
  const { setUnsaved } = useContext(SaveContext);
  const storeValues = useStoreConfigs();
  const refresh = useStoreRefresh();

  const loadout = useGenericConfig<Loadout>({
    storeApi: "loadouts.get",
    constraint: "loadoutType",
  });
  const skill = useGenericConfig<UnitSkill>({
    storeApi: "unitSkills.get",
    constraint: "loadoutId",
  });
  const algoPiece = useGenericConfig<AlgoPiece>({
    storeApi: "algoPieces.get",
    constraint: "loadoutId",
  });
  const slot = useGenericConfig<Slot>({
    storeApi: "slots.get",
    constraint: "algoPieceId",
  });

  const sUnits = rspc.useMutation(["units.save"]);
  const sLoadouts = rspc.useMutation(["loadouts.save"]);
  const sUnitSkills = rspc.useMutation(["unitSkills.save"]);
  const sAlgoPieces = rspc.useMutation(["algoPieces.save"]);
  const sSlots = rspc.useMutation(["slots.save"]);

  const saveUnits = async () => sUnits.mutateAsync(storeValues.dirtyUnits);
  const saveLoadouts = async () => sLoadouts.mutateAsync(loadout.dirtyData);
  const saveUnitSkills = async () => sUnitSkills.mutateAsync(skill.dirtyData);
  const saveAlgoPieces = async () =>
    sAlgoPieces.mutateAsync(algoPiece.dirtyData);
  const saveSlots = async () => sSlots.mutateAsync(slot.dirtyData);

  async function saveDatabase() {
    return Promise.all([
      saveUnits(),
      saveLoadouts(),
      saveUnitSkills(),
      saveAlgoPieces(),
      saveSlots(),
    ])
      .then(() => {
        refresh.refreshAll();
        fireToast({ header: SUCCESS, content: TOAST_SAVE_CONTENT_OK });
      })
      .catch((err) => {
        fireToast({
          header: "Save failed",
          content: `Saving data failed. Reason: ${err.message}`,
        });
      })
  }

  function algoFillSlot(loadoutId: string, allOrNone: boolean) {
    slot.data
      .filter((e) =>
        algoPiece.data
          .filter((e) => e.loadoutId == loadoutId)
          .map((e) => e.id)
          .includes(e.algoPieceId)
      )
      .forEach((sl) =>
        slot.updateData({ ...sl, value: allOrNone }, sl.algoPieceId)
      );
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

  const dirtyData = useMemo(
    () => [
      storeValues.dirtyUnits,
      loadout.dirtyData,
      skill.dirtyData,
      algoPiece.dirtyData,
      slot.dirtyData,
    ],
    [
      algoPiece.dirtyData,
      loadout.dirtyData,
      skill.dirtyData,
      slot.dirtyData,
      storeValues.dirtyUnits,
    ]
  );

  useEffect(() => {
    setUnsaved(
      dirtyData.reduce((accu, current) => accu || current.length > 0, false)
    );
  }, [dirtyData, setUnsaved]);

  return (
    <DbDollContext.Provider
      value={{
        ...storeValues,
        algoPiece,
        loadout,
        slot,
        skill,
        saveDatabase,
        algoFillSlot,
        undoChanges,
      }}
    >
      {children}
    </DbDollContext.Provider>
  );
};

export default DbDollProvider;
