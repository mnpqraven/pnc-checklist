import { useContext, useEffect } from "react";
import { LoadoutContainer } from "@/components/Common";
import React from "react";
import { DollContext, ToastContext } from "@/interfaces/payloads";
import { LoadoutType } from "@/src-tauri/bindings/enums";
import LoadoutConfig from "../Loadout/Config";
import Skeleton from "react-loading-skeleton";
import { SUCCESS, TOAST_SAVE_CONTENT_OK } from "@/utils/lang";
import DollHeader from "./Profile/Header";
import useSaveUnitsMutation from "@/utils/hooks/mutations/saveUnits";

const DollProfile = () => {
  const { dollData, setDollData } = useContext(DollContext);
  const loadouts: LoadoutType[] = ["current", "goal"];
  const { storeLoading, dirtyStore } = useContext(DollContext);
  const { setHeaderContent } = useContext(ToastContext);

  const { saveUnits } = useSaveUnitsMutation();
  const isLoading = !dollData || !setDollData || storeLoading;

  useEffect(() => {
    setHeaderContent(SUCCESS, TOAST_SAVE_CONTENT_OK);
  }, [setHeaderContent]);

  if (isLoading) return <Loading />;

  return (
    <div className="flex w-[54rem] flex-col">
      <DollHeader handleSave={() => saveUnits(dirtyStore)} />
      {/* NOTE: named css */}
      {loadouts.map((type, index) => (
        <div className="card component_space" key={index}>
          <div className="float-right">
            <LoadoutConfig unitHandler={setDollData} type={type} />
          </div>

          <LoadoutContainer
            type={type as LoadoutType}
            data={dollData ? dollData[type] : undefined}
          />
        </div>
      ))}
    </div>
  );
};

const Loading = () => (
  <div className="w-60">
    <Skeleton />
  </div>
);

export default DollProfile;
