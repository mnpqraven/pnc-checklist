import { Root, Track, Range, Thumb } from "@radix-ui/react-slider";
import { Root as Label } from "@radix-ui/react-label";

const SKILL_TYPE = { passive: "passive", auto: "auto" };
type SkillType = keyof typeof SKILL_TYPE;
type Props = {
  min: number;
  max: number;
  label: string;
  onChange: (e: number[]) => void;
  value: number;
  type: SkillType;
};

// <input className="p-0" type="range" min={min} max={max} />
const Slider = ({ label, min, max, value, type, onChange }: Props) => {
  return (
    <form>
      <Label className="LabelRoot" htmlFor={type}>
        {label}
      </Label>
      <Label className="LabelRoot float-right" htmlFor={type}>
        {value}
      </Label>

      <Root
        className="SliderRoot"
        min={min}
        max={max}
        id={type}
        aria-label={label}
        value={[value]}
        onValueChange={onChange}
      >
        <Track className="SliderTrack">
          <Range className="SliderRange" />
        </Track>
        <Thumb className="SliderThumb" />
      </Root>
    </form>
  );
};
export default Slider;
