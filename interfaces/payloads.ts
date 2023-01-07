import { AlgoCategory } from "@/src-tauri/bindings/enums/AlgoCategory";
import { Unit } from "@/src-tauri/bindings/structs/Unit";
import React from "react";
import { Updater } from "use-immer";

export type DollContextPayload = {
  dollData: Unit | null,
  setDollData: Updater<Unit | null> | undefined,
  updateDirtyList: ((e: Unit) => void) | undefined
}
export const DollContext = React.createContext<DollContextPayload>({
  dollData: null,
  setDollData: undefined,
  updateDirtyList: undefined
});

export type AlgoError = [ // ???
  category: AlgoCategory, indexes: number[]
]
export type AlgoErrorContextPayload = AlgoError[]
export const AlgoErrorContext = React.createContext<AlgoErrorContextPayload>([]);
