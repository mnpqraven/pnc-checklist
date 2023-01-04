import { UNITEXAMPLE } from "@/utils/constants";
import React from "react";
import { Updater } from "use-immer";
import { AlgoCategory, Unit } from "./datamodel"

export type DollContextPayload = {
  dollData: Unit,
  setDollData: Updater<Unit> | undefined,
  updateDirtyList: ((e: Unit) => void) | undefined
}
export const DollContext = React.createContext<DollContextPayload>({
  dollData: UNITEXAMPLE,
  setDollData: undefined,
  updateDirtyList: undefined
});

export type AlgoError = [ // ???
  category: AlgoCategory, indexes: number[]
]
export type AlgoErrorContextPayload = AlgoError[]
export const AlgoErrorContext = React.createContext<AlgoErrorContextPayload>([]);
