import { Algorithm } from "@/src-tauri/bindings/rspc";
import { algo_src, parseAlgoName } from "@/utils/helper";
import Image from "next/image";

type Props = {
  algo: Algorithm;
  onClick?: () => void;
};

const AlgoImage = ({ algo, onClick }: Props) => {
  return (
    <div className="flex h-[4rem] w-[4rem] items-center justify-center">
      <Image
        src={algo_src(parseAlgoName(algo))}
        alt={algo_src(algo)}
        width={256}
        height={256}
        onClick={onClick}
        priority
      />
    </div>
  );
};
export default AlgoImage;
