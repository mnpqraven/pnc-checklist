import { Root, Item, Indicator } from "@radix-ui/react-radio-group";
type Props = {
  options: any[];
  onChange: (e: string) => void;
  value?: string;
};
const RadioGroup = ({ value, options, onChange }: Props) => {
  return (
    <Root
      className="RadioGroupRoot"
      value={value}
      onValueChange={onChange}
      aria-label="View density"
    >
      {options.map((item, index) => (
        <div style={{ display: "flex", alignItems: "center" }} key={index}>
          <Item className="RadioGroupItem" value={item} id={`radio-${index}`}>
            <Indicator className="RadioGroupIndicator" />
          </Item>
          <label className="Label" htmlFor={`radio-${index}`}>
            {item}
          </label>
        </div>
      ))}
    </Root>
  );
};
export default RadioGroup;
