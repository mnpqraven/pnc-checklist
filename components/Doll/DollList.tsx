import DollListItem from "./DollListItem";
import { useContext, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { AnimatePresence, motion } from "framer-motion";
import Button from "../Button";
import { rspc } from "../Providers/ClientProviders";
import { Class, Unit } from "@/src-tauri/bindings/rspc";
import Loading from "../Loading";
import { DbDollContext } from "@/interfaces/payloads";
import { useStoreRefresh } from "@/utils/hooks/useStoreRefetch";

type Props = {
  filter: Class[];
  isVisible: (obj: Unit, pat: Class[]) => boolean;
};
const DollList = ({ filter, isVisible }: Props) => {
  const [deleteMode, setDeleteMode] = useState(false);
  const { updateCurrentUnitId, units } = useContext(DbDollContext);
  const { isLoading, isError } = rspc.useQuery(["units.get"]);
  const {
    data: los,
    isLoading: isLoadingLo,
    isError: isErrorLo,
  } = rspc.useQuery(["loadouts.get"]);
  const { refreshAll, refreshUnits } = useStoreRefresh();

  const newUnitMutation = rspc.useMutation(["unit.new"]);
  const deleteUnitMutation = rspc.useMutation(["unit.delete"]);

  function addUnit() {
    newUnitMutation.mutate([nextUnitName, "Guard"], {
      onSuccess: () => refreshAll(),
    });
  }

  function deleteUnit(unitId: string) {
    deleteUnitMutation.mutate(unitId, {
      onSuccess: () => refreshUnits(),
    });
  }

  if (isLoading || isLoadingLo || !los) return <Loading />;
  if (isError || isErrorLo) throw new Error("error in dev page");

  const nextUnitName = `Doll #${units.length + 1}`;
  //
  const currentLoadoutIds = units.map((unit) => {
    let find = los.find(
      (e) => e.loadoutType == "Current" && e.unitId == unit.id
    );
    if (find) return find.id;
    return "";
  });

  return (
    <ul id="dolllist" className="w-60">
      <div className="mt-3 flex gap-2 [&>*]:grow">
        <Button label={"New"} onClick={addUnit} />
        <Button onClick={() => setDeleteMode(!deleteMode)}>Delete</Button>
      </div>
      {!isLoading ? (
        <AnimatePresence mode="sync">
          {units.map(
            (unit, index) =>
              isVisible(unit, filter) && (
                <motion.li
                  key={index}
                  onClick={() => updateCurrentUnitId(unit.id)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <DollListItem
                    unit={unit}
                    currentLoadoutId={currentLoadoutIds[index]}
                    deleteMode={deleteMode}
                    deleteUnit={() => deleteUnit(unit.id)}
                  />
                </motion.li>
              )
          )}
        </AnimatePresence>
      ) : (
        <LoadingLi />
      )}
    </ul>
  );
};
const LoadingLi = () => {
  return (
    <>
      {[1, 2, 3].map((ind) => (
        <li key={ind}>
          <Skeleton count={2} />
        </li>
      ))}
    </>
  );
};
export default DollList;
