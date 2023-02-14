import { AlgoPiece, Unit } from "@/src-tauri/bindings/structs";
import { invoke } from "@tauri-apps/api/tauri";
import AlgoRequirementContainer from "@/components/Requirement/AlgorithmRequirementContainer";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Loading from "@/components/Loading";
import ErrorContainer from "@/components/Error";
import { IVK } from "@/src-tauri/bindings/invoke_keys";
import Button from "@/components/Button";

const Inventory = () => {
  const client = useQueryClient();
  const refetchLocker = () =>
    client.refetchQueries({ queryKey: [IVK.VIEW_LOCKER] });

  const lockerDataQuery = useQuery({
    queryKey: [IVK.VIEW_LOCKER],
    queryFn: () => invoke<[AlgoPiece | null, Unit | null][]>(IVK.VIEW_LOCKER),
  });

  function deleteKeychain(index: number) {
    invoke("remove_kc", { index }).then(refetchLocker);
  }

  function clear_ownerless() {
    invoke("clear_ownerless").then(refetchLocker);
  }

  if (lockerDataQuery.isLoading) return <Loading />;
  if (lockerDataQuery.isError) return <ErrorContainer />;

  return (
    <main>
      <div className="flex flex-col">
        <div className="card component_space flex w-fit flex-col items-start">
          <div className="flex">
            <p>current algos</p>
            <Button
              onClick={clear_ownerless}
              label={"clear unused algorithms"}
            />
          </div>

          {lockerDataQuery.data.map((e, index) => (
            <div key={index} className="flex flex-row">
              <Button
                onClick={() => deleteKeychain(index)}
                className="small red"
                label="Delete"
              />
              {e[0] ? e[0].name : "NULL"} - [{e[1] ? e[1].name : "NULL"}]
            </div>
          ))}
        </div>

        <div className="card component_space w-fit">
          <p>required algos</p>
          <AlgoRequirementContainer />
        </div>
      </div>
    </main>
  );
};

export default Inventory;
