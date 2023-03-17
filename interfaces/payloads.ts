import {
  AlgoCategory,
  AlgoPiece,
  Loadout,
  LoadoutType,
  Slot,
  Unit,
  UnitSkill,
} from "@/src-tauri/bindings/rspc";
import React from "react";

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
  fireToast: (to: { header?: string; content?: string }) => void;
};
export const ToastContext = React.createContext<ToastContextPayload>({
  open: false,
  setOpen: () => {},
  header: "Default Header",
  content: "Default Content",
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

  saveDatabase: () => Promise<any>;
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

  saveDatabase: async () => {},
  algoFillSlot: () => {},
  undoChanges: () => {},
});
