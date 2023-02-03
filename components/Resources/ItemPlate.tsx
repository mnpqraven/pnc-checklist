import Image from "next/image";

type Props = {
  width?: number;
  src: string;
  rarity: number;
  badge?: string; // TODO: TBD
};
const ItemPlate = ({ width, src, rarity }: Props) => {
  return (
    // NOTE: named css
    <div
      className={`iconplate itemrarity-${rarity}`}
      style={width ? { width: width } : {}}
    >
      <div className="iconwrap">
        <Image className="mainicon" src={src} alt={"widget"} fill />
      </div>
      <div className="plate"></div>
      <div className="back"></div>
    </div>
  );
};
export default ItemPlate;
