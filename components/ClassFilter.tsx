import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Root, Item } from "@radix-ui/react-toggle-group";
import { class_src } from "@/utils/helper";
import { useEnumTable } from "@/utils/hooks/useEnumTable";
import { ENUM_TABLE } from "@/src-tauri/bindings/ENUM_TABLE";
import { Class } from "@/src-tauri/bindings/rspc";

type Props = {
  onChange: (to: Class) => void;
};
const ClassFilter = ({ onChange }: Props) => {
  const { data: options } = useEnumTable<Class>(ENUM_TABLE.Class);

  if (!options) return null;
  return (
    <Root
      className="ToggleGroup"
      type="multiple"
      defaultValue={options}
      aria-label="Text alignment"
    >
      {options.map((item, index) => (
        <Item
          key={index}
          className="ToggleGroupItem"
          value={item}
          aria-label={item}
          defaultChecked={true}
          onClick={() => onChange(item)}
        >
          <Image src={class_src(item)} alt={item} width={24} height={24} />
        </Item>
      ))}
    </Root>
  );
};
export default ClassFilter;
