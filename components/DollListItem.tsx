import { Unit } from "@/interfaces";
import { Dispatch, SetStateAction } from "react";

type Props = {
  data: Unit,
}
const DollListItem = ({ data }: Props) => {
  return <p>{data.name}</p>
}

export default DollListItem;
