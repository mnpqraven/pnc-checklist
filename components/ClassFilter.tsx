import Image from "next/image";
import React from "react";
import { Root, Item } from "@radix-ui/react-toggle-group";
import { class_src } from "@/utils/helper";
import { Class } from "@/src-tauri/bindings/rspc";
import { rspc } from "./Providers/ClientProviders";

type Props = {
  onChange: (to: Class) => void;
};
const ClassFilter = ({ onChange }: Props) => {
  const { data } = rspc.useQuery(["enum.Class"]);

  if (!data) return null;

  const options = data.map((e) => e.label);

  return (
    <Root
      className="ToggleGroup"
      type="multiple"
      defaultValue={options}
      aria-label="Filter by class"
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
