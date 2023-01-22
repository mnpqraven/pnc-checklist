import { invoke } from "@tauri-apps/api/tauri"
import { ChangeEvent, useEffect, useState } from "react"

type Props = {
  options: string[],
  labelPayload?: { method: string, payload: string },
  value: any
  onChangeHandler: (value: ChangeEvent<HTMLSelectElement>) => void
}
const Select = ({ options, value, onChangeHandler, labelPayload }: Props) => {

  const [label, setLabel] = useState<string[]>([]);
  useEffect(() => {
    if (labelPayload) {
      invoke<string[]>(labelPayload.method, { payload: labelPayload.payload })
        .then(setLabel)
    }
  }, []);

  return (
    <select
      onChange={e => onChangeHandler(e)}
      value={value}
    >
      {options.map((item, index) => (
        <option key={index} value={item}>{labelPayload ? label[index] : item}</option>
      ))}
    </select>
  )
}
export default Select;
