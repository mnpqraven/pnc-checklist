import { LoadoutContainer } from "@/components/Common";
import DollHeader from "@/components/Doll/Profile/Header";
import DollPanelContainer from "@/components/Doll/Profile/PanelContainer";
import Loading from "@/components/Loading";
import { DbDollContext } from "@/interfaces/payloads";
import { LoadoutType } from "@/src-tauri/bindings/rspc";
import { useContext } from "react";

const Dev = () => {
  const { currentLoadout, goalLoadout } = useContext(DbDollContext);

  if (!currentLoadout || !goalLoadout) return <Loading />;
  const loadouts = [currentLoadout, goalLoadout];

  return (
    <main>
      <div className="big_container">
        <DollPanelContainer />
        <div className="flex w-[54rem] flex-col">
          <DollHeader />
          {loadouts.map((loadout, index) => (
            <div className="card component_space" key={index}>
              {/*
              <div className="float-right">
                <LoadoutConfig unitHandler={setDollData} type={type} />
              </div>
*/}
              <LoadoutContainer
                type={loadout.loadoutType as LoadoutType}
                data={loadout}
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};
export default Dev;
