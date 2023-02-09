import { AlgoCategory } from "@/src-tauri/bindings/enums/AlgoCategory";
import { Unit } from "@/src-tauri/bindings/structs/Unit";
import React from "react";
import { Updater } from "use-immer";

export type DollContextPayload = {
  dollData: Unit | undefined;
  setDollData: Updater<Unit> | undefined;
  storeLoading: boolean
};
export const DollContext = React.createContext<DollContextPayload>({
  dollData: undefined,
  setDollData: undefined,
  storeLoading: true
});

export type SaveContextPayload = {
  unsaved: boolean,
  setUnsaved: (to: boolean) => void
}
export const SaveContext = React.createContext<SaveContextPayload>({
  unsaved: false,
  setUnsaved: () => {}
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
