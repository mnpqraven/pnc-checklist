import { Dispatch, SetStateAction } from "react"
import { Unit } from "./datamodel"

export type DollContextPayload = {
  dollData: Unit | undefined,
  setDollData: Dispatch<SetStateAction<Unit | undefined>> | undefined,
  updateDirtyList: ((e: Unit) => void) | undefined
}