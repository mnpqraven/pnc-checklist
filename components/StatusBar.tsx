import { Unit } from "@/interfaces"

type Props = {
  save_changes: () => void
}
const StatusBar = ({ save_changes }: Props) => {

  return (
    <>
      <p>status bar</p>
      <button onClick={() => save_changes()}>update changes</button>
    </>
  )
}
export default StatusBar