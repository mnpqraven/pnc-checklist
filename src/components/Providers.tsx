import { ParentComponent } from "solid-js";
import rspc, { client, queryClient } from "../rspc";

const Providers: ParentComponent = (props) => {
  return (
    <rspc.Provider client={client} queryClient={queryClient}>
      {props.children}
    </rspc.Provider>
  );
}
export default Providers;
