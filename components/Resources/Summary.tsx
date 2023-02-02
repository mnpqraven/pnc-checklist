import ItemPlate from "./ItemPlate";
import Image from "next/image";
import Loading from "../Loading";
import { class_src } from "@/utils/helper";
import { useNeededRscQuery } from "@/utils/queryHooks";

const Summary = () => {
  const { data: req } = useNeededRscQuery();

  // if (isLoading) return <Loading />;
  // if (isError) return <Loading />;

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
