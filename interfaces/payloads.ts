import React from "react";
import { Dispatch, SetStateAction } from "react"
import { AlgoCategory, Unit } from "./datamodel"

export type DollContextPayload = {
  dollData: Unit | undefined,
  setDollData: Dispatch<SetStateAction<Unit | undefined>> | undefined,
  updateDirtyList: ((e: Unit) => void) | undefined
}
export const DollContext = React.createContext<DollContextPayload>({
  dollData: undefined,
  setDollData: undefined,
  updateDirtyList: undefined
});

export type AlgoError = [ // ???
  category: AlgoCategory, indexes: number[]
]
export type AlgoErrorContextPayload = AlgoError[]
export const AlgoErrorContext = React.createContext<AlgoErrorContextPayload>([]);
