import { LoadoutType } from "@/src-tauri/bindings/enums";
import { AlgoSet, Unit } from "@/src-tauri/bindings/structs";
import { DEFAULT_LEVEL } from "@/utils/defaults";
import { useContext, useState } from "react";
import { Updater } from "use-immer";
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
import { DollContext } from "@/interfaces/payloads";

type Props = {
  unitHandler: Updater<Unit>;
  type: LoadoutType;
};

const ConfigDev = ({ type: loadoutType, unitHandler: setDollData }: Props) => {
  const { dollData } = useContext(DollContext);

  const [keepOpen, setKeepOpen] = useState(false);

  function fillAlgo(all: boolean, e: Event) {
    if (keepOpen) e.preventDefault();
  }
  function updateLevel(to: number, e: Event) {
    if (keepOpen) e.preventDefault();
    setDollData((draft) => {
      draft[loadoutType].level = to;
      return draft;
    });
  }
  function clearNeural(e: Event) {
    if (keepOpen) e.preventDefault()
    setDollData((draft) => {
      draft[loadoutType].frags = 0;
      return draft;
    });
  }

  if (!dollData) return null;
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
                    checked={dollData[loadoutType].level === level}
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

          {loadoutType !== "goal" && (
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
                {["This section", "Unit"].map((loadout, index) => (
                  <Item className="DropdownMenuItem" key={index}>
                    {loadout} <div className="RightSlot" />
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
export default ConfigDev;
