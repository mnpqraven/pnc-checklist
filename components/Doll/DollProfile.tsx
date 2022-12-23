import { Unit, CLASS, Class } from "@/interfaces"
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import ClassSelect from "@/components/ClassSelect";
import Loadout from "@/components/Loadout";

type Props = {
  unit: Unit | undefined
  setUnit: Dispatch<SetStateAction<Unit | undefined>>,
}
const DollProfile = ({ unit, setUnit }: Props) => {

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    let name = e.currentTarget.value;
    if (unit !== undefined) {
      setUnit({ ...unit, name: name });
    } else throw new Error("[DollProfile] undefined Unit should never see this");
  }

  const [unitClass, setUnitClass] = useState<Class>("Guard");

  if (unit !== undefined) return (
    <>
      <input
        type="text"
        id="name"
        value={unit.name}
        onChange={e => handleChange(e)}
      />
      <ClassSelect
        options={Object.values(CLASS)}
        value={unit.class}
        valueHandler={(value) => setUnitClass(value)}
      />
      <p>current loadout:</p>
      <Loadout
        skill_level={unit.current.skill_level}
        algo={unit.current.algo}
      />
    </>
  )
  return <Empty />
}
export default DollProfile;

const Empty = () => (
  <>
    <p>select a doll</p>
  </>
)