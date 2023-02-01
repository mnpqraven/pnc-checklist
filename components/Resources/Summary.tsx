import { invoke } from "@tauri-apps/api/tauri";
import { useEffect } from "react";
import ItemPlate from "./ItemPlate";
import Image from "next/image";
import Loading from "../Loading";
import { useImmer } from "use-immer";
import { WidgetResource, GrandResource } from "@/src-tauri/bindings/structs";
import { class_src } from "@/utils/helper";

const hide_empty = true; // toggle TBD
const EMPTY_GRAND: GrandResource = {
  skill: { token: 0, pivot: 0 },
  coin: 0,
  exp: 0,
  neural_kits: 0,
  widgets: [],
};
const Summary = () => {
  const [req, setReg] = useImmer<GrandResource>(EMPTY_GRAND);

  useEffect(() => {
    console.log("[mount] page resources");

    invoke<GrandResource>("get_needed_rsc").then((e) => {
      if (hide_empty) {
        let noempty: WidgetResource[] = [];
        e.widgets.map((classchunk) => {
          if (!classchunk.widget_inventory.every((t) => t == 0)) {
            noempty.push(classchunk);
          }
        });
        setReg((draft) => {
          draft = { ...e };
          draft.widgets = noempty;
          return draft;
        });
      } else setReg(e);
    });
  }, []);
  useEffect(() => {
    console.log(req);
  }, [req]);

  return (
    <div className="w-min">
      <h1>amount needed:</h1>
      <div className="flex flex-col items-center">
        <div className="flex flex-row">
          <div>
            <ItemPlate src={"/warehouse/skill_token.png"} rarity={0} />
            <p>{req.skill.token}</p>
          </div>
          <div>
            <ItemPlate src={"/warehouse/skill_pivot.png"} rarity={4} />
            <p>{req.skill.pivot}</p>
          </div>
          <div>
            <ItemPlate src={"/warehouse/coin.png"} rarity={4} />
            <p>{req.coin}</p>
          </div>
        </div>
        <div>
          {req.widgets.length > 0 && (
            <table>
              <thead>
                <tr>
                  <th>
                    <div className="w-14"></div>
                  </th>
                  {req.widgets[0] ? (
                    req.widgets[0].widget_inventory.map((item, index) => (
                      <th key={index}>
                        <ItemPlate
                          src={`/warehouse/widget_box_${
                            index > 4 ? 4 : index
                          }.png`}
                          rarity={index}
                        />
                      </th>
                    ))
                  ) : (
                    <Loading />
                  )}
                </tr>
              </thead>
              <tbody>
                {req.widgets.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <Image
                        src={class_src(item.class)}
                        alt={item.class}
                        width={24}
                        height={24}
                      />
                    </td>
                    {item.widget_inventory.map((tier, index2) => (
                      <td key={index2}>{tier}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
export default Summary;
