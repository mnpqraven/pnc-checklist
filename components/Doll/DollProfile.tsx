import { useContext, useEffect } from "react";
import { LoadoutContainer } from "@/components/Common";
import React from "react";
import {
  DbDollContext,
  ToastContext,
} from "@/interfaces/payloads";
import Skeleton from "react-loading-skeleton";
import { SUCCESS, TOAST_SAVE_CONTENT_OK } from "@/utils/lang";
import DollHeader from "./Profile/Header";
import { LoadoutType } from "@/src-tauri/bindings/rspc";

const DollProfile = () => {
  const { loadout, currentUnitId, saveUnits } = useContext(DbDollContext);
  const { setHeaderContent } = useContext(ToastContext);

  useEffect(() => {
    setHeaderContent(SUCCESS, TOAST_SAVE_CONTENT_OK);
  }, []);

  return (
    <div className="flex w-[54rem] flex-col">
      <DollHeader handleSave={saveUnits} />
      {/* NOTE: named css */}
      {loadout.data
        .filter((e) => e.unitId == currentUnitId)
        .map((loadout, index) => (
          <div className="card component_space" key={index}>
            <div className="float-right">
              {/* INFO: IN QUEUE AFTER ALGO
            <LoadoutConfig
              unitHandler={() => {}}
              type={loadout.loadoutType as LoadoutType}
            />
          */}
            </div>

            <LoadoutContainer
              type={loadout.loadoutType as LoadoutType}
              data={loadout}
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
