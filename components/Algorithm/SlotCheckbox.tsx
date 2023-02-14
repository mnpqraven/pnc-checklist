import { AlgoCategory, Class } from "@/src-tauri/bindings/enums";
import { IVK } from "@/src-tauri/bindings/invoke_keys";
import { AlgoSlot } from "@/src-tauri/bindings/structs";
import * as Checkbox from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";
import { invoke } from "@tauri-apps/api/tauri";
import { useEffect, useState } from "react";

type Props = {
  unitClass: Class;
  value: AlgoSlot;
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
    let s = await invoke<number>(IVK.DEFAULT_SLOT_SIZE, {
      class: unitClass,
      category,
    });
    setSize(s);
    return s;
  }

  useEffect(() => {
    setVisible(unitClass, category).then((size) =>
      setClickable(size - value.filter((slot) => slot.value).length)
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
          key={slot.placement}
          checked={slot.value}
          onCheckedChange={(e) => {
            onChangeHandler(e, index);
            updateVisible(e);
          }}
          disabled={!slot.value && clickable === 0}
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
