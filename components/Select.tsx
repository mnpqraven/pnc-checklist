import { ChangeEvent } from "react"

type Props = {
  options: string[],
  label?: string[],
  value: any
  onChangeHandler: (value: ChangeEvent<HTMLSelectElement>) => void
}
const Select = ({ options, value, onChangeHandler, label }: Props) => {
  return (
    <select
      onChange={e => onChangeHandler(e)}
      value={value}
    >
      {options.map((item, index) => (
        <option key={index} value={item}>{label ? label[index] : item}</option>
      ))}
    </select>
  )
}
export default Select;
