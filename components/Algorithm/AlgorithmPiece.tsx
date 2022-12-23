import { AlgoPiece } from "@/interfaces"

type Props = {
  data: AlgoPiece
}
const AlgorithmPiece = ({ data }: Props) => {
  return (
    <>
      <p>{data.name} {data.stat} {data.slot}</p>
    </>
  )
}
export default AlgorithmPiece