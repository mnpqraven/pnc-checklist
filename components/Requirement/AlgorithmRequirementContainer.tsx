import { IVK } from "@/src-tauri/bindings/invoke_keys";
import { AlgorithmRequirement } from "@/src-tauri/bindings/structs";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/tauri";
import ErrorContainer from "../Error";
import Loading from "../Loading";
import AlgoRequirement from "./AlgorithmRequirement";

const AlgoRequirementContainer = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: [IVK.REQUIREMENT_ALGO_STORE],
    queryFn: () => invoke<AlgorithmRequirement[]>(IVK.REQUIREMENT_ALGO_STORE),
  });

  if (isLoading) return <Loading />;
  if (isError) return <ErrorContainer />;

  return (
    <>
      {data.map((algoReq, index) => (
        <fieldset key={index}>
          <legend>{algoReq.from_unit.name}</legend>
          <AlgoRequirement data={algoReq} />
        </fieldset>
      ))}
    </>
  );
};
export default AlgoRequirementContainer;
