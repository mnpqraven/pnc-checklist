import { AlgoSet } from "@/interfaces"
import getKeys from "@/utils/helper"
import AlgorithmPiece from "./AlgorithmPiece"

type Props = {
  algo: AlgoSet
}
const AlgoSet = ({ algo }: Props) => {

  return (
    <>
      {algo.offense.map((piece, index) => (
        <AlgorithmPiece
          key={index}
          data={piece} />
      ))}
      {algo.stability.map((piece, index) => (
        <AlgorithmPiece
          key={index}
          data={piece} />
      ))}
      {algo.special.map((piece, index) => (
        <AlgorithmPiece
          key={index}
          data={piece} />
      ))}
    </>
  )
}
export default AlgoSet