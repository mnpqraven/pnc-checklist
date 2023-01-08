import Image from "next/image";
import styles from "@/styles/ItemPlate.module.css";
type Props = {
  width?: number;
  src: string;
  rarity: number;
};
const ItemPlate = ({ width, src, rarity }: Props) => {
  return (
    <div
      className={`${styles.iconplate} ${styles[`itemrarity-${rarity}`]}`}
      style={width ? { width: width } : {}}
    >
      <div className={styles.iconwrap}>
        <Image className="mainicon" src={src} alt={"widget"} fill />
      </div>
      <div className={styles.plate}></div>
      <div className={styles.back}></div>
    </div>
  );
};
export default ItemPlate;
