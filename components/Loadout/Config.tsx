import { LoadoutType } from "@/src-tauri/bindings/enums";
import { AlgoSet, Unit } from "@/src-tauri/bindings/structs";
import { DEFAULT_LEVEL } from "@/utils/defaults";
import { useState } from "react";
import { Updater } from "use-immer";

type Props = {
  unitHandler: Updater<Unit>;
  type: LoadoutType;
};
const LoadoutConfig = ({ type: loadout_type, unitHandler: setUnit }: Props) => {
  const [display, setDisplay] = useState(false);

  function fillAlgo(filled: boolean) {
    const cats = ["offense", "stability", "special"] as (keyof AlgoSet)[];
    setUnit((draft) => {
      cats.forEach((cat) => {
        draft[loadout_type].algo[cat].forEach((piece, index) => {
          piece.slot.forEach((_, indexslot) => {
            draft[loadout_type].algo[cat][index].slot[indexslot] = filled;
          });
        });
      });
      return draft;
    });
  }

  function updateLevel(to: number) {
    setUnit((draft) => {
      draft[loadout_type].level = to;
      return draft;
    });
  }

  function clearFrags() {
    setUnit((draft) => {
      draft[loadout_type].frags = 0;
      return draft;
    });
  }
  if (display)
    return (
      <>
        <button
          className="Button small violet"
          onClick={() => setDisplay(!display)}
        >
          toggle
        </button>
        <div className="flex flex-row">
          algorithm:
          <button
            className="Button small violet"
            onClick={() => fillAlgo(true)}
          >
            select all
          </button>
          <button
            className="Button small violet"
            onClick={() => fillAlgo(false)}
          >
            select none
          </button>
        </div>
        <div className="flex flex-row">
          level:
          {[DEFAULT_LEVEL, 60, 70].map((level, index) => (
            <button
              className="Button small violet"
              key={index}
              onClick={() => updateLevel(level)}
            >
              {level}
            </button>
          ))}
        </div>
        <div className="flex flex-row">
          <button className="Button small violet" onClick={clearFrags}>
            clear frags
          </button>
        </div>
      </>
    );
  return (
    <button
      className="Button small violet"
      onClick={() => setDisplay(!display)}
    >
      toggle
    </button>
  );
};

import React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  HamburgerMenuIcon,
  DotFilledIcon,
  CheckIcon,
  ChevronRightIcon,
} from "@radix-ui/react-icons";

const ConfigDev = () => {
  const [bookmarksChecked, setBookmarksChecked] = React.useState(true);
  const [urlsChecked, setUrlsChecked] = React.useState(false);
  const [person, setPerson] = React.useState("pedro");

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="IconButton" aria-label="Customise options">
          <HamburgerMenuIcon />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className="DropdownMenuContent" sideOffset={5}>
          <DropdownMenu.Item className="DropdownMenuItem" disabled>
            Algorithm Options<div className="RightSlot"></div>
          </DropdownMenu.Item>

          <DropdownMenu.Item className="DropdownMenuItem">
            Select All <div className="RightSlot"></div>
          </DropdownMenu.Item>
          <DropdownMenu.Item className="DropdownMenuItem">
            Select None <div className="RightSlot"></div>
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="DropdownMenuSeparator" />

          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger className="DropdownMenuSubTrigger">
              Set level to ...
              <div className="RightSlot">
                <ChevronRightIcon />
              </div>
            </DropdownMenu.SubTrigger>
            <DropdownMenu.Portal>
              <DropdownMenu.SubContent
                className="DropdownMenuSubContent"
                sideOffset={2}
                alignOffset={-5}
              >
                {[DEFAULT_LEVEL, 60, 70].map((level) => (
                  <DropdownMenu.CheckboxItem
                    key={level}
                    className="DropdownMenuCheckboxItem"
                    checked={urlsChecked}
                    onCheckedChange={setUrlsChecked}
                  >
                    <DropdownMenu.ItemIndicator className="DropdownMenuItemIndicator">
                      <CheckIcon />
                    </DropdownMenu.ItemIndicator>
                    {level}
                    <div className="RightSlot" />
                  </DropdownMenu.CheckboxItem>
                ))}
              </DropdownMenu.SubContent>
            </DropdownMenu.Portal>
          </DropdownMenu.Sub>

          <DropdownMenu.Item className="DropdownMenuItem">
            Clear Neural Fragments <div className="RightSlot"></div>
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="DropdownMenuSeparator" />
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger className="DropdownMenuSubTrigger">
              Undo changes to...
              <div className="RightSlot">
                <ChevronRightIcon />
              </div>
            </DropdownMenu.SubTrigger>
            <DropdownMenu.Portal>
              <DropdownMenu.SubContent
                className="DropdownMenuSubContent"
                sideOffset={2}
                alignOffset={-5}
              >
                {["This section", "Unit"].map((loadout) => (
                  <DropdownMenu.Item className="DropdownMenuItem">
                    {loadout} <div className="RightSlot" />
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.SubContent>
            </DropdownMenu.Portal>
          </DropdownMenu.Sub>

          <DropdownMenu.Arrow className="DropdownMenuArrow" />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
export default ConfigDev;
