/* eslint-disable react-hooks/exhaustive-deps */
import { DollList, DollProfile } from "@/components/Doll";
import DollProvider from "@/components/Doll/DollProvider";
import DollPanelContainer from "@/components/Doll/Profile/PanelContainer";

const Dolls = () => (
  <main>
      <div className="big_container">
        <DollPanelContainer />
        <DollProfile />
      </div>
  </main>
);
export default Dolls;
