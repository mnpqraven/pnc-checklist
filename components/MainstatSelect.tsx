import { AlgoCategory } from "@/src-tauri/bindings/enums";
import { AlgoMainStat } from "@/src-tauri/bindings/rspc";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";
import * as Select from "@radix-ui/react-select";
import { rspc } from "./Providers/ClientProviders";

type Props = {
  value: any;
  options: AlgoMainStat[];
  onChangeHandler: (value: string) => void;
  category: AlgoCategory;
};

const MainstatSelect = ({
  value,
  options,
  onChangeHandler,
  category,
}: Props) => {
  // const label = useEnumLabel(labelPayload);
  // TODO: custom hook
  const { data: labels } = rspc.useQuery(["listAlgoMainstat", options]);

  if (!labels) return null;

  const selectStructs: { key: AlgoMainStat; label: string }[] = options.map(
    (option, index) => ({
      key: option,
      label: labels[index],
    })
  );

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
              {selectStructs.map(({ key: option, label }, index) => (
                <Select.Item key={index} className="SelectItem" value={option}>
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
export default MainstatSelect;
