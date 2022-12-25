import { Unit, CLASS, Class } from "@/interfaces/datamodel"
import { ChangeEvent, useContext } from "react";
import Select from "@/components/Select";
import Loadout from "@/components/Loadout";
import { DollContext } from "@/pages/dolls";

type Props = {
  dirtyListHandler: (data: Unit) => void
}
const DollProfile = ({ dirtyListHandler: updateDirty }: Props) => {
  const { dollData, setDollData } = useContext(DollContext);
  const defined = dollData && setDollData

  function handleNameChange(e: ChangeEvent<HTMLInputElement>) {
    if (defined) {
      let editedData = { ...dollData, name: e.currentTarget.value }
      setDollData(editedData);
      updateDirty(editedData);
    }
  }
  function handleClassChange(e: ChangeEvent<HTMLSelectElement>) {
    if (defined) {
      let editedData = { ...dollData, class: e.currentTarget.value as Class }
      setDollData(editedData)
      updateDirty(editedData);
    }
  }

  if (dollData !== undefined) return (
    <>
      <input
        type="text"
        id="name"
        value={dollData.name}
        onChange={handleNameChange}
      />
      <Select
        options={Object.values(CLASS)}
        value={dollData.class}
        onChangeHandler={handleClassChange}
      />
      <p>current loadout:</p>
      <Loadout
        skill_level={dollData.current.skill_level}
        algo={dollData.current.algo}
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