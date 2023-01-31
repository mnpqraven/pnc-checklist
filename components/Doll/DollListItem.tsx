import { Unit } from "@/src-tauri/bindings/structs";

type Props = {
  data: Unit;
};
const DollListItem = ({ data }: Props) => {
  return <p>{data.name ? data.name : "No name"}</p>;
};

export default DollListItem;
