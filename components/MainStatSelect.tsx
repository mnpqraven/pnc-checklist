import { AlgoCategory, AlgoMainStat } from "@/src-tauri/bindings/rspc";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";
import * as Select from "@radix-ui/react-select";

type Props = {
  value: any;
  options: AlgoMainStat[];
  onChangeHandler: (value: string) => void;
  category: AlgoCategory;
};

const MainStatSelect = ({
  value,
  options,
  onChangeHandler,
  category,
}: Props) => {
  return (
    <Select.Root onValueChange={onChangeHandler} value={value}>
      <Select.Trigger className="SelectTrigger" aria-label="Main Stat">
        <Select.Value />
        <Select.Icon className="SelectIcon">
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content className="SelectContent">
          <Select.ScrollUpButton className="SelectScrollButton">
            <ChevronUpIcon />
          </Select.ScrollUpButton>

          <Select.Viewport className="SelectViewport">
            <Select.Group>
              <Select.Label className="SelectLabel">
                {category} Algorithms
              </Select.Label>
              {options.map((label, index) => (
                <Select.Item key={index} className="SelectItem" value={label}>
                  <Select.ItemText>{label}</Select.ItemText>
                  <Select.ItemIndicator className="SelectItemIndicator">
                    <CheckIcon />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Group>

            <Select.Separator />
          </Select.Viewport>

          <Select.ScrollDownButton className="SelectScrollButton">
            <ChevronDownIcon />
          </Select.ScrollDownButton>
          <Select.Arrow />
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};
export default MainStatSelect;
