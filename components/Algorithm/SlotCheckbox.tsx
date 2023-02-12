import { AlgoCategory, Class } from "@/src-tauri/bindings/enums";
import { Slot } from "@/src-tauri/bindings/structs/Slot";
import * as Checkbox from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";
import { invoke } from "@tauri-apps/api/tauri";
import { ChangeEvent, useEffect, useState } from "react";

type Props = {
  unitClass: Class;
  value: Slot[];
  category: AlgoCategory;
  onChangeHandler: (value: boolean | "indeterminate", index: number) => void;
};
const SlotCheckbox = ({
  unitClass,
  value,
  category,
  onChangeHandler,
}: Props) => {
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
      setClickable(size - value.filter(slot => Object.values(slot)).length)
    );
  }, [category, unitClass, value]);

  function updateVisible(e: boolean | "indeterminate") {
    let val = typeof e === "boolean" ? e : false;

    if (val && size == 2) setClickable(clickable - 1);
    else setClickable(clickable + 1);
  }

  return (
    <div className="flex gap-2">
      {value.map((slot, index) => (
        <Checkbox.Root
          className="CheckboxRoot"
          key={index}
          checked={Object.values(slot)[0]}
          onCheckedChange={(e) => {
            onChangeHandler(e, index);
            updateVisible(e);
          }}
          disabled={!Object.values(slot)[0] && clickable === 0}
        >
          <Checkbox.Indicator className="CheckboxIndicator">
            <CheckIcon />
          </Checkbox.Indicator>
        </Checkbox.Root>
      ))}
    </div>
  );
};
export default SlotCheckbox;
