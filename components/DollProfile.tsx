import { Unit, CLASS } from "@/interfaces"
import { ChangeEvent, Dispatch, SetStateAction } from "react";
import Select from "./Select";

type Props = {
  unit: Unit | undefined
  setUnit: Dispatch<SetStateAction<Unit | undefined>>,
}
const DollProfile = ({ unit, setUnit }: Props) => {
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    let name = e.currentTarget.value;
    if (unit !== undefined) {
      setUnit({ ...unit, name: name });
    } else throw new Error("should never see this (DollProfile.tsx)");
  }

  if (unit === undefined) {
    return (
      <>
        <p>select a doll</p>
      </>
    )
  }
  else return (
    <>
      <input
        type="text"
        id="name"
        value={unit.name}
        onChange={e => handleChange(e)}
      />
      <Select data={Object.values(CLASS)} />
    </>
  )
}
export default DollProfile
