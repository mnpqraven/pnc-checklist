import { WidgetResource } from "@/src-tauri/bindings/structs";
import { class_src } from "@/utils/helper";
import Image from "next/image";
import { Loading } from "../Common";
import ItemPlate from "./ItemPlate";

const WidgetTable = ({ widgets }: { widgets: WidgetResource[] }) => {
  const lowerOf = (a: number, b: number) => (a > b ? b : a);
  return (
    <div id="req-widgets">
      {widgets.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>
                {/* spacer for top left cell*/}
                <div className="w-14"></div>
              </th>
              {widgets[0] ? (
                widgets[0].widget_inventory.map((_, rarity) => (
                  <th key={rarity}>
                    <ItemPlate
                      src={`/warehouse/widget_box_${lowerOf(4, rarity)}.png`}
                      rarity={rarity}
                    />
                  </th>
                ))
              ) : (
                <Loading />
              )}
            </tr>
          </thead>
          <tbody>
            {widgets.map((item, index_row) => (
              <tr key={index_row}>
                <td>
                  <Image
                    src={class_src(item.class)}
                    alt={item.class}
                    width={24}
                    height={24}
                  />
                </td>
                {item.widget_inventory.map((amount, index_col) => (
                  <td key={index_col}>{amount}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default WidgetTable;
