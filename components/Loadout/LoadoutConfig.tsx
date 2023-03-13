import { DEFAULT_LEVEL } from "@/utils/defaults";
import { useContext, useState } from "react";
import {
  Root,
  Trigger,
  Portal,
  Content,
  Item,
  Separator,
  Sub,
  SubTrigger,
  SubContent,
  CheckboxItem,
  ItemIndicator,
  Arrow,
} from "@radix-ui/react-dropdown-menu";
import {
  HamburgerMenuIcon,
  CheckIcon,
  ChevronRightIcon,
} from "@radix-ui/react-icons";
import { DbDollContext } from "@/interfaces/payloads";
import { LoadoutType } from "@/src-tauri/bindings/rspc";

type Props = {
  type: LoadoutType;
};
const UNDO_TYPES = {
  LOADOUT: "This section",
  UNIT: "This unit",
} as const;
type UndoTypes = keyof typeof UNDO_TYPES;

const LoadoutConfig = ({ type: loadoutType }: Props) => {
  const undoTypes: UndoTypes[] = ["LOADOUT", "UNIT"];

  const { currentUnitId, loadout, algoFillSlot, undoChanges } =
    useContext(DbDollContext);
  const thisLoadout = loadout.data.find(
    (e) => e.unitId == currentUnitId && e.loadoutType == loadoutType
  );

  const [keepOpen, setKeepOpen] = useState(false);

  function fillAlgo(allOrNone: boolean, e: Event) {
    if (keepOpen) e.preventDefault();
    if (thisLoadout) algoFillSlot(thisLoadout.id, allOrNone);
  }

  function updateLevel(to: number, e: Event) {
    if (keepOpen) e.preventDefault();
    if (thisLoadout) {
      loadout.updateData({ ...thisLoadout, level: to }, loadoutType);
    } else throw "should always find a valid loadout";
  }

  function clearNeural(e: Event) {
    if (keepOpen) e.preventDefault();
    if (thisLoadout) {
      loadout.updateData({ ...thisLoadout, frags: 0 }, loadoutType);
    } else throw "should always find a valid loadout";
  }

  function undoChange(type: UndoTypes, e: Event) {
    if (keepOpen) e.preventDefault();
    undoChanges(currentUnitId, loadoutType, type);
  }

  return (
    <Root>
      <Trigger asChild>
        <button className="IconButton" aria-label="Customise options">
          <HamburgerMenuIcon />
        </button>
      </Trigger>

      <Portal>
        <Content className="DropdownMenuContent" sideOffset={5}>
          <Item className="DropdownMenuItem" disabled>
            Algorithm Options<div className="RightSlot"></div>
          </Item>

          {[true, false].map((bool, index) => (
            <Item
              key={index}
              className="DropdownMenuItem"
              onSelect={(e) => fillAlgo(bool, e)}
            >
              Select {bool ? "All" : "None"} <div className="RightSlot"></div>
            </Item>
          ))}

          <Separator className="DropdownMenuSeparator" />

          <Sub>
            <SubTrigger className="DropdownMenuSubTrigger">
              Set level to ...
              <div className="RightSlot">
                <ChevronRightIcon />
              </div>
            </SubTrigger>
            <Portal>
              <SubContent
                className="DropdownMenuSubContent"
                sideOffset={2}
                alignOffset={-5}
              >
                {[DEFAULT_LEVEL, 60, 70].map((level) => (
                  <CheckboxItem
                    key={level}
                    className="DropdownMenuCheckboxItem"
                    checked={thisLoadout?.level === level}
                    onSelect={(e) => updateLevel(level, e)}
                  >
                    <ItemIndicator className="DropdownMenuItemIndicator">
                      <CheckIcon />
                    </ItemIndicator>
                    {level}
                    <div className="RightSlot" />
                  </CheckboxItem>
                ))}
              </SubContent>
            </Portal>
          </Sub>

          {loadoutType !== "Goal" && (
            <Item className="DropdownMenuItem" onSelect={clearNeural}>
              Clear Neural Fragments <div className="RightSlot"></div>
            </Item>
          )}

          <Separator className="DropdownMenuSeparator" />
          <Sub>
            <SubTrigger className="DropdownMenuSubTrigger">
              Undo changes to...
              <div className="RightSlot">
                <ChevronRightIcon />
              </div>
            </SubTrigger>
            <Portal>
              <SubContent
                className="DropdownMenuSubContent"
                sideOffset={2}
                alignOffset={-5}
              >
                {undoTypes.map((loadout, index) => (
                  <Item
                    className="DropdownMenuItem"
                    key={index}
                    onSelect={(e) => undoChange(loadout, e)}
                  >
                    {UNDO_TYPES[loadout]} <div className="RightSlot" />
                  </Item>
                ))}
              </SubContent>
            </Portal>
          </Sub>

          <CheckboxItem
            className="DropdownMenuCheckboxItem"
            checked={!keepOpen}
            onSelect={(e) => {
              e.preventDefault();
              setKeepOpen(!keepOpen);
            }}
          >
            <ItemIndicator className="DropdownMenuItemIndicator">
              <CheckIcon />
            </ItemIndicator>
            Auto-close this window
            <div className="RightSlot" />
          </CheckboxItem>

          <Arrow className="DropdownMenuArrow" />
        </Content>
      </Portal>
    </Root>
  );
};
export default LoadoutConfig;
