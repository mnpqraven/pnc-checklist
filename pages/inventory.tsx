import { AlgoPiece, Unit } from "@/src-tauri/bindings/structs";
import { invoke } from "@tauri-apps/api/tauri";
import AlgoRequirementContainer from "@/components/Requirement/AlgorithmRequirementContainer";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Loading from "@/components/Loading";

const Inventory = () => {
  const client = useQueryClient();
  const refetchLocker = () => client.refetchQueries({ queryKey: ["locker"] });

  const lockerDataQuery = useQuery({
    queryKey: ["locker"],
    queryFn: () => invoke<[AlgoPiece | null, Unit | null][]>("view_locker"),
  });

  function deleteKeychain(index: number) {
    invoke("remove_kc", { index }).then(refetchLocker);
  }

  async function clear_ownerless() {
    await invoke("clear_ownerless").then(refetchLocker);
  }

  if (lockerDataQuery.isLoading) return <Loading />;
  if (lockerDataQuery.isError) return <p>error</p>;

  return (
    <main>
      <>
        <div className='card'>
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
        <div className='card'>
          <p>required algos</p>
          <AlgoRequirementContainer />
        </div>
      </>
    </main>
  );
};

export default Inventory;
