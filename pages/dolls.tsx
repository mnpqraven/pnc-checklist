import { DollProfile } from "@/components/Doll";
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
