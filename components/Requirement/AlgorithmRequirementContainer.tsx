import { AlgorithmRequirement } from "@/src-tauri/bindings/structs";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/tauri";
import Loading from "../Loading";
import AlgoRequirement from "./AlgorithmRequirement";

const AlgoRequirementContainer = () => {
  const algoRequirementQuery = useQuery({
    queryKey: ["algo_req"],
    queryFn: () => invoke<AlgorithmRequirement[]>("dev_algo"),
  });

  if (algoRequirementQuery.isLoading) return <Loading />;
  if (algoRequirementQuery.isError) return <p>error</p>;

  return (
    <>
      {algoRequirementQuery.data.map((algoReq, index) => (
        <fieldset key={index}>
          <legend>{algoReq.from_unit.name}</legend>
          <AlgoRequirement data={algoReq} />
        </fieldset>
      ))}
    </>
  );
};
export default AlgoRequirementContainer;
