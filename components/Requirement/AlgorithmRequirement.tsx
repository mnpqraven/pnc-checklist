import {
  AlgoPiece,
  AlgorithmRequirement,
  AlgoSlot,
} from "@/src-tauri/bindings/structs";
import { useMainStatQuery } from "@/utils/hooks/algo/useAlgoMainStatQuery";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/tauri";
import AlgoImage from "../Algorithm/AlgoImage";
import ErrorContainer from "../Error";
import Loading from "../Loading";

const AlgoRequirement = ({ data }: { data: AlgorithmRequirement }) => {
  const { pieces, from_unit } = data; // from_unit unused
  const labels = useMainStatQuery(pieces);
  const hasReq = (algo: AlgoPiece) => !algo.slot.every((e) => e.value);

  const {
    data: isFulfilled,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["algoReqFulfilled", from_unit],
    queryFn: () => invoke<boolean>("algo_req_fulfilled", { algoReq: data }),
  });

  if (isLoading || !labels.every((e) => e.isSuccess)) return <Loading />;
  if (isError || !!labels.find((e) => e.isError)) return <ErrorContainer />;

  const p = pieces.map((piece, index) => {
    return {
      algo: piece,
      mainstat: labels[index].data,
    };
  });

  if (!isFulfilled)
    return (
      <div className="flex">
        {p.map(
          ({ algo, mainstat }, index) =>
            hasReq(algo) && (
              <div key={index} className="flex">
                <div className="h-auto w-auto">
                  <AlgoImage algo={algo.name} />
                </div>
                <div className="flex flex-col">
                  <fieldset>
                    <legend>{mainstat}</legend>
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
          <input type="checkbox" checked={slot.value} readOnly />
        </div>
      ))}
    </div>
  );
};

export default AlgoRequirement;
