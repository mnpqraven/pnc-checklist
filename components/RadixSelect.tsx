import * as Label from "@radix-ui/react-label";
import * as Switch from "@radix-ui/react-switch";
import * as Select from "@radix-ui/react-select";
import classnames from "classnames";
import Image from "next/image";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";
import React from "react";
import * as Toggle from "@radix-ui/react-toggle";
import { RadiobuttonIcon } from "@radix-ui/react-icons";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import {
  TextAlignLeftIcon,
  TextAlignCenterIcon,
  TextAlignRightIcon,
} from "@radix-ui/react-icons";
import { class_src } from "@/utils/helper";
import { Class } from "@/src-tauri/bindings/enums";

type Props = {
  onFilter: (to: Class) => void;
};

// TODO: better options pass
// styling
const ClassFilter = ({ onFilter }: Props) => {
  const options: Class[] = [
    "Guard",
    "Medic",
    "Warrior",
    "Specialist",
    "Sniper",
  ];

  return (
    <>
      <ToggleGroup.Root
        className="ToggleGroup"
        type="multiple"
        defaultValue={options}
        aria-label="Text alignment"
      >
        {options.map((item, index) => (
          <ToggleGroup.Item
            key={index}
            className="ToggleGroupItem"
            value={item}
            aria-label={item}
            defaultChecked={true}
            onClick={() => onFilter(item)}
          >
            <Image src={class_src(item)} alt={item} width={24} height={24} />
          </ToggleGroup.Item>
        ))}
      </ToggleGroup.Root>
    </>
  );
};

export default ClassFilter;
