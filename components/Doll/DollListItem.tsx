import { Unit } from "@/interfaces/datamodel";
import { Dispatch, SetStateAction } from "react";

type Props = {
  data: Unit,
}
const DollListItem = ({ data }: Props) => {
  return <p>{data.name ? data.name : 'No name'}</p>
}

export default DollListItem;
