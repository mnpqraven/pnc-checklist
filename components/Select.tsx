import { useLabel } from "@/utils/hooks/useLabel";
import { ChangeEvent } from "react";

type Props = {
  options: string[];
  labelPayload?: { method: string; payload: string };
  value: any;
  onChangeHandler: (value: ChangeEvent<HTMLSelectElement>) => void;
};
const Select = ({ options, value, onChangeHandler, labelPayload }: Props) => {
  const label = useLabel(labelPayload);

  return (
    <select
      data-testid={value} // value for jest
      onChange={(e) => onChangeHandler(e)}
      value={value}
    >
      {options.map((item, index) => (
        <option key={index} value={item}>
          {labelPayload ? label[index] : item}
        </option>
      ))}
    </select>
  );
};
export default Select;
