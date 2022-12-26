import { Dispatch, SetStateAction } from "react"
import { AlgoCategory, Unit } from "./datamodel"

export type DollContextPayload = {
  dollData: Unit | undefined,
  setDollData: Dispatch<SetStateAction<Unit | undefined>> | undefined,
  updateDirtyList: ((e: Unit) => void) | undefined
}
export type AlgoError = [ // ???
  category: AlgoCategory, indexes: number[]
 ]
export type AlgoErrorContextPayload = AlgoError[]