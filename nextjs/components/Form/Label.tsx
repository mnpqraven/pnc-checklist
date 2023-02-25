import { ChangeEvent, HTMLInputTypeAttribute } from "react";
import { Root } from "@radix-ui/react-label";

type Props = {
  label: string;
  value: string | number;
  id: string;
  flex?: "col" | "row";
  type?: HTMLInputTypeAttribute;
  min?: number;
  max?: number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};
const Label = ({
  label,
  value,
  id,
  flex = "row",
  type = "text",
  onChange,
  min,
  max,
}: Props) => {
  return (
    <div className={`flex flex-${flex} [&>*]:mx-2`}>
      <Root className="LabelRoot" htmlFor={id}>
        {label}
      </Root>
      <input
        type={type}
        id={id}
        min={min}
        max={max}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};
export default Label;
