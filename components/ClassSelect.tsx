import { Class } from "@/interfaces/datamodel"

type Props = {
  options: string[],
  value: Class
  valueHandler: (value: any) => void
}
const ClassSelect = ({ options, value, valueHandler }: Props) => {
  return (
    <select
      onChange={valueHandler}
      value={value}
    >
      {options.map((item) => (
        <option key={item} value={item}>{item}</option>
      ))}
    </select>
  )
}
export default ClassSelect;