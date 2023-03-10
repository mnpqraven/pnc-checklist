import { AlgoCategory } from "@/src-tauri/bindings/enums/AlgoCategory";
import { Unit } from "@/src-tauri/bindings/structs/Unit";
import React from "react";
import { DraftFunction, Updater } from "use-immer";

export type DollContextPayload = {
  dollData: Unit | undefined;
  setDollData: Updater<Unit> | undefined;
  storeLoading: boolean
  index: number,
  updateIndex: (to: number) => void,
  dirtyStore: Unit[],
  updateDirtyStore: (to: Unit[] | DraftFunction<Unit[]>) => void
};
export const DollContext = React.createContext<DollContextPayload>({
  dollData: undefined,
  setDollData: undefined,
  storeLoading: true,
  index: 0,
  updateIndex: () => { },
  dirtyStore: [],
  updateDirtyStore: () => { }
});

export type SaveContextPayload = {
  isUnsaved: boolean,
  setUnsaved: (to: boolean) => void
}
export const SaveContext = React.createContext<SaveContextPayload>({
  isUnsaved: false,
  setUnsaved: () => { }
})

export type ToastContextPayload = {
  open: boolean;
  setOpen: (e: boolean) => void
  header: string
  content: string
  setHeaderContent: (header?: string, content?: string) => void
  fireToast: () => void
}
export const ToastContext = React.createContext<ToastContextPayload>({
  open: false,
  setOpen: () => { },
  header: "Default Header",
  content: "Default Content",
  setHeaderContent: () => { },
  fireToast: () => { }
})

export type AlgoError = [
  // ???
  category: AlgoCategory,
  indexes: number[]
];
export type AlgoErrorContextPayload = AlgoError[];
export const AlgoErrorContext = React.createContext<AlgoErrorContextPayload>(
  []
);
