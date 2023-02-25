import React from "react";
import { Root, Thumb } from "@radix-ui/react-switch";

type Props = {
  id: string;
  label?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void
};
const Switch = ({ id, label, checked, onCheckedChange }: Props) => (
  <div className="flex items-center">
    <label className="Label" htmlFor={id} style={{ paddingRight: 15 }}>
      {label}
    </label>
    <Root className="SwitchRoot" id={id} checked={checked} onCheckedChange={onCheckedChange}>
      <Thumb className="SwitchThumb" />
    </Root>
  </div>
);

export default Switch;
