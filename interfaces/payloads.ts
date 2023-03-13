import { AlgoCategory } from "@/src-tauri/bindings/enums/AlgoCategory";
import {
  AlgoPiece,
  Loadout,
  LoadoutType,
  Slot,
  Unit,
  UnitSkill,
} from "@/src-tauri/bindings/rspc";
import React from "react";
import { DraftFunction, Updater } from "use-immer";

export type DollContextPayload = {
  dollData: Unit | undefined;
  setDollData: Updater<Unit> | undefined;
  storeLoading: boolean;
  currentUnitId: string;
  updateCurrentUnitId: (to: string) => void;
  dirtyStore: Unit[];
  updateDirtyStore: (to: Unit[] | DraftFunction<Unit[]>) => void;
};
export const DollContext = React.createContext<DollContextPayload>({
  dollData: undefined,
  setDollData: undefined,
  storeLoading: true,
  currentUnitId: "",
  updateCurrentUnitId: () => {},
  dirtyStore: [],
  updateDirtyStore: () => {},
});

export type SaveContextPayload = {
  isUnsaved: boolean;
  setUnsaved: (to: boolean) => void;
};
export const SaveContext = React.createContext<SaveContextPayload>({
  isUnsaved: false,
  setUnsaved: () => {},
});

export type ToastContextPayload = {
  open: boolean;
  setOpen: (e: boolean) => void;
  header: string;
  content: string;
  setHeaderContent: (header?: string, content?: string) => void;
  fireToast: () => void;
};
export const ToastContext = React.createContext<ToastContextPayload>({
  open: false,
  setOpen: () => {},
  header: "Default Header",
  content: "Default Content",
  setHeaderContent: () => {},
  fireToast: () => {},
});

export type AlgoError = [
  // ???
  category: AlgoCategory,
  indexes: number[]
];
export type AlgoErrorContextPayload = AlgoError[];
export const AlgoErrorContext = React.createContext<AlgoErrorContextPayload>(
  []
);

export interface DbDataProvider<Type> {
  data: Type[];
  updateData: (to: Type, equals: string) => void;
  refetch: () => void;
}
export type DbDollContextPayload = {
  currentUnit: Unit | undefined;
  updateCurrentUnit: (to: Unit) => void;
  currentUnitId: string;
  updateCurrentUnitId: (to: string) => void;
  units: Unit[];

  loadout: DbDataProvider<Loadout>;
  skill: DbDataProvider<UnitSkill>;
  algoPiece: DbDataProvider<AlgoPiece>;
  slot: DbDataProvider<Slot>;

  saveDatabase: () => void;
  algoFillSlot: (loadoutId: string, allOrNone: boolean) => void;
  undoChanges: (
    unitId: string,
    loadoutType: LoadoutType,
    undoType: "LOADOUT" | "UNIT"
  ) => void;
};

const placeholder = { data: [], updateData: () => {}, refetch: () => {} };
export const DbDollContext = React.createContext<DbDollContextPayload>({
  units: [],
  currentUnit: undefined,
  updateCurrentUnit: () => {},
  currentUnitId: "",
  updateCurrentUnitId: () => {},

  loadout: placeholder,
  skill: placeholder,
  algoPiece: placeholder,
  slot: placeholder,

  saveDatabase: () => {},
  algoFillSlot: () => {},
  undoChanges: () => {},
});
