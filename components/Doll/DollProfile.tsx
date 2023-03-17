import { useContext } from "react";
import { LoadoutContainer } from "@/components/Common";
import React from "react";
import { DbDollContext } from "@/interfaces/payloads";
import Skeleton from "react-loading-skeleton";
import DollHeader from "./Profile/Header";
import { LoadoutType } from "@/src-tauri/bindings/rspc";
import LoadoutConfig from "../Loadout/LoadoutConfig";

const DollProfile = () => {
  const { loadout, currentUnitId } = useContext(DbDollContext);

  return (
    <div className="flex w-[54rem] flex-col">
      <DollHeader />
      {/* NOTE: named css */}
      {loadout.data
        .filter((e) => e.unitId == currentUnitId)
        .map((loadout, index) => (
          <div className="card component_space" key={index}>
            <div className="float-right">
              {/* INFO: IN QUEUE AFTER ALGO */}
              <LoadoutConfig type={loadout.loadoutType as LoadoutType} />
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
