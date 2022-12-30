import { AlgoSet, LoadoutType, Unit, UnitSkill } from "@/interfaces/datamodel"
import AlgorithmSet from "@/components/Algorithm/AlgorithmSet"
import { ChangeEvent, useContext } from "react"
import { DollContext } from "@/interfaces/payloads"
import styles from "@/styles/Page.module.css"

type Props = {
  skill_level: UnitSkill | undefined,
  algo: AlgoSet,
  type: LoadoutType
}
const Loadout = ({ skill_level, algo, type }: Props) => {
  const { dollData, setDollData, updateDirtyList } = useContext(DollContext);
  const defined = dollData && setDollData && updateDirtyList

  function handleSlvChange(e: ChangeEvent<HTMLInputElement>, type: string) {
    if (defined) {
      // TODO: try useImmer
      let clone: Unit = { ...dollData };
      if (clone.current.skill_level) {
        switch (type) {
          case 'passive':
            clone.current.skill_level.passive = +e.target.value;
            break;
          case 'auto':
            clone.current.skill_level.auto = +e.target.value;
            break;
        }
      }
      updateDirtyList(clone)
    }
  }
  return (
    <div className={`${styles.card} ${styles.component_space}`}>
      <p>Skill level: </p>
      <div>
        <input
          type="number" min={1} max={10}
          value={skill_level?.passive}
          onChange={e => handleSlvChange(e, 'passive')}
        />
        <input
          type="number" min={1} max={10}
          value={skill_level?.auto}
          onChange={e => handleSlvChange(e, 'auto')}
        />
      </div>
      <AlgorithmSet
        algo={algo}
        type={type}
      />
    </div>
  )
}
export default Loadout
