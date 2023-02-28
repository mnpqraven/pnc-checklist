import { useContext, useEffect } from "react";
import { LoadoutContainer } from "@/components/Common";
import React from "react";
import {
  DbDollContext,
  DollContext,
  ToastContext,
} from "@/interfaces/payloads";
import LoadoutConfig from "../Loadout/Config";
import Skeleton from "react-loading-skeleton";
import { SUCCESS, TOAST_SAVE_CONTENT_OK } from "@/utils/lang";
import DollHeader from "./Profile/Header";
import { LoadoutType } from "@/src-tauri/bindings/rspc";

const DollProfile = () => {
  const { currentLoadout, goalLoadout } = useContext(DbDollContext);
  const { setHeaderContent } = useContext(ToastContext);

  const isLoading = !currentLoadout || !goalLoadout;

  useEffect(() => {
    setHeaderContent(SUCCESS, TOAST_SAVE_CONTENT_OK);
  }, []);

  if (isLoading) return <Loading />;
  const loadouts = [currentLoadout, goalLoadout];

  return (
    <div className="flex w-[54rem] flex-col">
      <DollHeader handleSave={() => {}} />
      {/* NOTE: named css */}
      {loadouts.map((loadout, index) => (
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
