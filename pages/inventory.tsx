import { AlgoPiece, Unit } from "@/src-tauri/bindings/structs";
import { invoke } from "@tauri-apps/api/tauri";
import AlgoRequirementContainer from "@/components/Requirement/AlgorithmRequirementContainer";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Loading from "@/components/Loading";
import ErrorContainer from "@/components/Error";
import { INVOKE_KEYS } from "@/src-tauri/bindings/invoke_keys";

const Inventory = () => {
  const client = useQueryClient();
  const refetchLocker = () =>
    client.refetchQueries({ queryKey: [INVOKE_KEYS.VIEW_LOCKER] });

  const lockerDataQuery = useQuery({
    queryKey: [INVOKE_KEYS.VIEW_LOCKER],
    queryFn: () =>
      invoke<[AlgoPiece | null, Unit | null][]>(INVOKE_KEYS.VIEW_LOCKER),
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
            <button onClick={clear_ownerless}>clear unused algorithms</button>
          </div>

          {lockerDataQuery.data.map((e, index) => (
            <div key={index} className="flex flex-row">
              <button onClick={() => deleteKeychain(index)}>delete</button>
              <p>
                {e[0] ? e[0].name : "NULL"} - [{e[1] ? e[1].name : "NULL"}]
              </p>
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
