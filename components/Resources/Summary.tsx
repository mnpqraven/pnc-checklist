import ItemPlate from "./ItemPlate";
import Image from "next/image";
import Loading from "../Loading";
import { class_src } from "@/utils/helper";
import { useNeededRscQuery } from "@/utils/hooks/useNeededRscQuery";
import WidgetTable from "./WidgetTable";

type ItemPlateParams = {
  src: string;
  amount: number;
  rarity: number;
};
const Summary = () => {
  const { data: req, isLoading } = useNeededRscQuery();

  const itemPlates: ItemPlateParams[] = [
    { src: "exp", amount: req.exp, rarity: 0 },
    { src: "coin", amount: req.coin, rarity: 0 },
    { src: "skill_token", amount: req.skill.token, rarity: 1 },
    { src: "skill_pivot", amount: req.skill.pivot, rarity: 4 },
  ];

  if (isLoading) return <Loading />

  return (
    <div className="w-min">
      <h1>amount needed:</h1>
      <div className="flex flex-col items-center">
        <div className="flex flex-row">
          {itemPlates.map(({ src, amount, rarity }, index) => (
            <div key={index}>
              <ItemPlate src={`/warehouse/${src}.png`} rarity={rarity} />
              <p>{amount}</p>
            </div>
          ))}
        </div>
        <WidgetTable widgets={req.widgets}  />
      </div>
    </div>
  );
};
export default Summary;
