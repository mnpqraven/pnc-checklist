import { AlgoSet, UnitSkill } from "@/interfaces"
import AlgorithmSet from "@/components/Algorithm/AlgorithmSet"

type Props = {
  skill_level: UnitSkill | undefined,
  algo: AlgoSet
}
const Loadout = ({ skill_level, algo }: Props) => {

  return (
    <>
      <p>Skill level: {skill_level?.passive}/{skill_level?.auto}</p>
      <AlgorithmSet algo={algo}/>
    </>
  )
}
export default Loadout