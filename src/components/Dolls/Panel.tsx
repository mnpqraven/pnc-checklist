import { Index } from "solid-js";
import rspc from "../../rspc";

const DollPanel = () => {
  const units = rspc.createQuery(() => ["units"]);

  return (
    <ul>
      <Index each={units.data}>
        {(unit) => (
          <li>
            {unit().class} - {unit().name}
          </li>
        )}
      </Index>
    </ul>
  );
};
export default DollPanel;
