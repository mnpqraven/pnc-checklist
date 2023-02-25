import DollHeader from "../components/Dolls/Header";
import DollLoadoutContainer from "../components/Dolls/Loadout";
import DollPanel from "../components/Dolls/Panel";

const Dolls = () => {
  return (
    <div class="flex flex-row">
      <DollPanel />
      <div class="flex flex-col">
        <DollHeader />
        <DollLoadoutContainer />
      </div>
    </div>
  );
};
export default Dolls;
