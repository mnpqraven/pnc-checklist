import { AlgoCategory } from "@/src-tauri/bindings/enums";
import { useEnumLabel } from "@/utils/hooks/useEnumLabel";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";
import * as Select from "@radix-ui/react-select";

type Props = {
  value: any;
  labelPayload?: { method: string; payload: any };
  options: string[];
  onChangeHandler: (value: string) => void;
  category: AlgoCategory;
};
const MainstatSelect = ({
  value,
  labelPayload,
  options,
  onChangeHandler,
  category,
}: Props) => {
  const label = useEnumLabel(labelPayload);

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
              {options.map((item, index) => (
                <Select.Item key={index} className="SelectItem" value={item}>
                  <Select.ItemText>{label[index]}</Select.ItemText>
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
export default MainstatSelect;
