import { DbDollContext } from "@/interfaces/payloads";
import { AlgoCategory, Class } from "@/src-tauri/bindings/enums";
import { IVK } from "@/src-tauri/bindings/invoke_keys";
import { Slot } from "@/src-tauri/bindings/rspc";
import * as Checkbox from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";
import { invoke } from "@tauri-apps/api/tauri";
import { useContext, useEffect, useState } from "react";
import Loading from "../Loading";

type Props = {
  unitClass: Class;
  category: AlgoCategory;
  pieceId: string;
};
const SlotCheckbox = ({
  unitClass,
  category,
  pieceId,
}: Props) => {
  const [clickable, setClickable] = useState(2); // default case for 2 falses
  const [size, setSize] = useState(2);
  const { slots, updateSlot } = useContext(DbDollContext);

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
      setClickable(size - slots.filter((e) => e.algoPieceId === pieceId && e.value).length)
    );
  }, [category, unitClass, slots]);

  /**
   * Updates the slots in an `AlgoPiece`
   * @param value new value of the slot managed by thecheckbox
   * @param checkboxIndex the index of the slot in the `AlgoPiece`
   */
  function onChange(value: boolean | "indeterminate", slot: Slot) {
    if (value === "indeterminate") return;
    updateSlot({ ...slot, value}, pieceId);
    updateVisible(value);
  }

  function updateVisible(e: boolean | "indeterminate") {
    let val = typeof e === "boolean" ? e : false;

    if (val && size == 2) setClickable(clickable - 1);
    else setClickable(clickable + 1);
  }

  if (!slots) return <Loading />;

  return (
    <div className="flex gap-2">
      {slots
        .filter((e) => e.algoPieceId == pieceId)
        .map((slot) => (
          <Checkbox.Root
            className="CheckboxRoot"
            key={slot.placement}
            checked={slot.value}
            onCheckedChange={(e) => onChange(e, slot)}
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
