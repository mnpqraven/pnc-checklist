import {
  AlgoMainStat,
  Algorithm,
  SlotPlacement,
} from "@/src-tauri/bindings/enums";
import { ENUM_TABLE } from "@/src-tauri/bindings/ENUM_TABLE";
import { IVK } from "@/src-tauri/bindings/invoke_keys";
import {
  AlgoPiece,
  AlgorithmRequirement,
  AlgoSlot,
  Unit,
} from "@/src-tauri/bindings/structs";
import { deduplicate } from "@/utils/helper";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/tauri";
import AlgoImage from "../Algorithm/AlgoImage";
import AlgorithmPiece from "../Algorithm/AlgorithmPiece";

const AlgoRequirementGroup = () => {
  const {
    data: algoReq,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [IVK.REQUIREMENT_ALGO_STORE],
    queryFn: () => invoke<AlgorithmRequirement[]>(IVK.REQUIREMENT_ALGO_STORE),
  });

  const { data: slotIter } = useQuery({
    queryKey: [IVK.ENUM_LS, ENUM_TABLE.SlotPlacement],
    queryFn: () =>
      invoke<SlotPlacement[]>(IVK.ENUM_LS, { name: ENUM_TABLE.SlotPlacement }),
  });
  const { data: newTable } = useQuery({
    queryKey: ["new_table"],
    queryFn: () => invoke<[AlgoPiece, Unit][][]>("algo_req_table_piece"),
  });

  if (isLoading) return null;
  if (isError) throw Error("error");

  function getSlot(slot: AlgoSlot, component: SlotPlacement) {
    let find = slot.find((e) => e.placement == component);
    if (find) return find.value ? "yes" : "no";
    return "null";
  }
  function mainStatRow(pieces: AlgoPiece[], algo: Algorithm): AlgoMainStat[] {
    return deduplicate(pieces.filter((e) => e.name == algo).map((e) => e.stat));
  }

  function pieceRow(
    pieces: AlgoPiece[],
    algo: Algorithm,
    stat: AlgoMainStat
  ): AlgoPiece[] {
    return pieces.filter((e) => e.name == algo && e.stat == stat);
  }

  type Owner = { unit: Unit; piece: AlgoPiece };
  let table: { algo: Algorithm; owners: Owner[] }[] = [];
  algoReq.forEach(({ pieces, from_unit }) => {
    pieces.forEach((piece) => {
      if (!table.map(({ algo }) => algo).includes(piece.name)) {
        table.push({
          algo: piece.name,
          owners: [{ unit: from_unit, piece }],
        });
      } else {
        table
          .find((e) => e.algo == piece.name)
          ?.owners.push({ unit: from_unit, piece });
      }
    });
  });
  if (!slotIter) return null;
  if (!newTable) return null;
  // {slotIter.map((slot, index) => (
  //   <tr>
  //     <td>Component {index + 1}</td>
  //     {newTable.map((owner, index) => (
  //       <td key={index}>
  //         {owner.unit.name}
  //         {getSlot(owners[index].piece.slot, slot)}
  //       </td>
  //     ))}
  //   </tr>
  // ))}

  return (
    <>
      {table.map(({ algo, owners }, index) => (
        <div key={index} className="flex items-center">
          <AlgoImage algo={algo} />
          <table>
            <thead>
              <tr>
                <th>/</th>
                {deduplicate(owners.map((e) => e.piece.stat)).map(
                  (piece, index) => (
                    <th key={index}>{piece}</th>
                  )
                )}
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      ))}
      {newTable.map((e, index) => (
        <table>
          <thead>
            <tr>
              <th>/</th>
              {[...new Set(e.map((e) => e[0].stat))].map((mainStat) => (
                <th>{mainStat}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Component</td>
              {e.map(([piece, unit]) => (
                <td>
                  {piece.name} {piece.stat} - {unit.name}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      ))}
    </>
  );
};
export default AlgoRequirementGroup;
