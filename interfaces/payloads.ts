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

export type DbDollContextPayload = {
  currentUnit: Unit | undefined;
  updateCurrentUnit: (to: Unit) => void;
  currentUnitId: string;
  updateCurrentUnitId: (to: string) => void;
  units: Unit[];

  loadouts: Loadout[];
  updateLoadout: (to: Loadout, type: LoadoutType) => void;

  skills: UnitSkill[];
  updateSkill: (to: UnitSkill, loadoutId: string) => void;

  algoPieces: AlgoPiece[];
  updatePiece: (to: AlgoPiece, loadoutId: string) => void;

  slots: Slot[];
  updateSlot: (to: Slot, algoPieceId: string) => void;

  saveUnits: () => void
};
export const DbDollContext = React.createContext<DbDollContextPayload>({
  units: [],
  currentUnit: undefined,
  updateCurrentUnit: () => {},
  currentUnitId: "",
  updateCurrentUnitId: () => {},

  loadouts: [],
  updateLoadout: () => {},

  skills: [],
  updateSkill: () => {},

  algoPieces: [],
  updatePiece: () => {},

  slots: [],
  updateSlot: () => {},

  saveUnits: () => {}
});
