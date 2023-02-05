import {
  AlgoPiece,
  AlgorithmRequirement,
  AlgoSlot,
} from "@/src-tauri/bindings/structs";
import { algo_src } from "@/utils/helper";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/tauri";
import Image from "next/image";
import ErrorContainer from "../Error";
import Loading from "../Loading";

const AlgoRequirement = ({ data }: { data: AlgorithmRequirement }) => {
  const { pieces, from_unit } = data; // from_unit unused
  const hasReq = (algo: AlgoPiece) => !algo.slot.every((e) => !e);

  const {
    data: isFulfilled,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["algoReqFulfilled", from_unit],
    queryFn: () => invoke<boolean>("algo_req_fulfilled", { algoReq: data }),
  });

  if (isLoading) return <Loading />;
  if (isError) return <ErrorContainer />

  if (!isFulfilled)
    return (
      <div className="flex">
        {pieces.map(
          (algo, index) =>
            hasReq(algo) && (
              <div key={index} className="flex">
                <div className="h-auto w-auto">
                  <Image
                    src={algo_src(algo.name)}
                    alt={algo.name}
                    width={60}
                    height={60}
                    priority
                  />
                </div>
                <div className="flex flex-col">
                  <fieldset>
                    <legend>{algo.stat}</legend>
                    <DisplaySlot slots={algo.slot} />
                  </fieldset>
                </div>
              </div>
            )
        )}
      </div>
    );

  return <>all good!</>;
};

const DisplaySlot = ({ slots }: { slots: AlgoSlot }) => {
  return (
    <div id="DisplaySlot" className="flex">
      {slots.map((slot, index) => (
        <div key={index}>
          <input type="checkbox" checked={slot} readOnly />
        </div>
      ))}
    </div>
  );
};

export default AlgoRequirement;
