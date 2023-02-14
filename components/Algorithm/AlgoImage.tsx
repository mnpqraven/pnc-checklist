import { Algorithm } from "@/src-tauri/bindings/enums";
import { algo_src } from "@/utils/helper";
import Image from "next/image";

type Props = {
  algo: Algorithm;
  onClick?: () => void;
};

const AlgoImage = ({ algo, onClick }: Props) => {
  // TODO: need max-h configured
  return (
    <div className="w-16">
      <Image
        src={algo_src(algo)}
        alt={algo_src(algo)}
        className="w-auto"
        width={256}
        height={256}
        onClick={onClick}
        priority
      />
    </div>
  );
};
export default AlgoImage;
