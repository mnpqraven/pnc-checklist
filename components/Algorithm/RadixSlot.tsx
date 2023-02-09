import { AlgoCategory, Class } from "@/src-tauri/bindings/enums";
import * as Checkbox from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";
import { invoke } from "@tauri-apps/api/tauri";
import { ChangeEvent, useEffect, useState } from "react";

type Props = {
  unitClass: Class;
  value: boolean[];
  category: AlgoCategory;
  onChangeHandler: (
    value: ChangeEvent<HTMLInputElement> | boolean | "indeterminate",
    index: number
  ) => void;
};
const RadixSlot = ({ unitClass, value, category, onChangeHandler }: Props) => {
  const [clickable, setClickable] = useState(2); // default case for 2 falses
  const [size, setSize] = useState(2);

  async function setVisible(
    unitClass: Class,
    category: AlgoCategory
  ): Promise<number> {
    let s = await invoke<number>("default_slot_size", {
      class: unitClass,
      category,
    });
    setSize(s);
    return s;
  }

  useEffect(() => {
    setVisible(unitClass, category).then((size) =>
      setClickable(size - value.filter(Boolean).length)
    );
  }, [category, unitClass, value]);

  function updateVisible(
    e: ChangeEvent<HTMLInputElement> | boolean | "indeterminate"
  ) {
    let val = true;
    if (typeof e === "boolean") val = e;
    else if (e === "indeterminate") val = false;
    else {
      console.log(e);
      val = e.currentTarget.checked;
    }

    if (val === true) {
      if (size == 2) {
        setClickable(clickable - 1);
      }
    } else {
      setClickable(clickable + 1);
    }
  }
  return (
    <div className="flex">
      {value.map((checked, index) => (
        <Checkbox.Root
          className="CheckboxRoot"
          key={index}
          checked={checked}
          onCheckedChange={(e) => {
            onChangeHandler(e, index);
            updateVisible(e);
          }}
          disabled={!checked && clickable === 0}
        >
          <Checkbox.Indicator className="CheckboxIndicator">
            <CheckIcon />
          </Checkbox.Indicator>
        </Checkbox.Root>
      ))}
    </div>
  );
};
export default RadixSlot;
