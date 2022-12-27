import { ChangeEvent } from "react"

type Props = {
  options: string[],
  value: any
  onChangeHandler: (value: ChangeEvent<HTMLSelectElement>) => void
}
const Select = ({ options, value, onChangeHandler }: Props) => {
  return (
    <select
      onChange={e => onChangeHandler(e)}
      value={value}
    >
      {options.map((item, index) => (
        <option key={index} value={item}>{item}</option>
      ))}
    </select>
  )
}
export default Select;
