import {
  AlgoMainStat,
  Algorithm,
  SlotPlacement,
} from "@/src-tauri/bindings/enums";
import { ENUM_TABLE } from "@/src-tauri/bindings/ENUM_TABLE";
import { IVK } from "@/src-tauri/bindings/invoke_keys";
import { AlgoPiece, Unit } from "@/src-tauri/bindings/structs";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/tauri";
import AlgoImage from "../Algorithm/AlgoImage";

type Props = {
  detailMode: boolean;
};
const AlgoRequirementGroup = ({ detailMode }: Props) => {
  const { data: newTable } = useQuery({
    queryKey: ["new_table"],
    queryFn: () => invoke<[AlgoPiece, Unit][][]>("algo_req_table_piece"),
  });
  if (!newTable) return null;

  return (
    <>
      {newTable.map((row, indRow) => (
        <div className="flex items-end" key={indRow}>
          <AlgoImage algo={row[0][0].name} />
          <ReqTable
            rowData={row}
            algo={row[0][0].name}
            colData={row.map((e) => e[0].stat)}
            detailMode={detailMode}
          />
        </div>
      ))}
    </>
  );
};

/// returns unique mainstats and corresponding colSpans for said mainStat
function mergeDuplicates(allMainStatsPresent: AlgoMainStat[]): {
  cols: AlgoMainStat[];
  spans: number[];
} {
  let spans = [1];
  let cols: AlgoMainStat[] = [];
  allMainStatsPresent.forEach((col) => {
    if (cols.includes(col)) spans[cols.indexOf(col)]++;
    else {
      cols.push(col);
      spans.push(1);
    }
  });
  return { cols, spans };
}

type ReqTableProps = {
  algo: Algorithm;
  rowData: [AlgoPiece, Unit][];
  colData: AlgoMainStat[];
  detailMode: boolean;
};
const ReqTable = ({ algo, rowData, colData, detailMode }: ReqTableProps) => {
  const { data: slotIter } = useQuery({
    queryKey: [IVK.ENUM_LS, ENUM_TABLE.SlotPlacement],
    queryFn: () =>
      invoke<SlotPlacement[]>(IVK.ENUM_LS, { name: ENUM_TABLE.SlotPlacement }),
  });

  const { data: slotSize } = useQuery({
    queryKey: [IVK.ALGO_GET_SLOT_SIZE, algo],
    queryFn: () => invoke<number>(IVK.ALGO_GET_SLOT_SIZE, { algo }),
  });

  if (!slotIter || !slotSize) return null;
  const slotIterWithBound = slotIter.slice(0, slotSize);

  return (
    <table>
      <thead>
        <tr>
          <th>Main Stat</th>
          <ReqTableHeader colData={colData} />
        </tr>
      </thead>
      <tbody>
        {slotIterWithBound.map((component, indComponent) => (
          <tr key={indComponent}>
            <td>Component {indComponent + 1}</td>
            {detailMode ? (
              <ReqTableBodyDetailed component={component} rowData={rowData} />
            ) : (
              <ReqTableBodySimple
                component={component}
                uniqueMainstats={mergeDuplicates(colData).cols}
                colSpans={mergeDuplicates(colData).spans}
                rowData={rowData}
              />
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const ReqTableBodySimple = ({
  component,
  uniqueMainstats,
  rowData,
  colSpans,
}: {
  component: SlotPlacement;
  uniqueMainstats: AlgoMainStat[];
  rowData: [AlgoPiece, Unit][];
  colSpans: number[];
}) => {
  function getTruesByComponent(
    data: [AlgoPiece, Unit][],
    component: SlotPlacement,
    mainStat: AlgoMainStat
  ): number {
    let res: number = 0;
    data.forEach(([piece, _]) => {
      if (
        piece.stat == mainStat &&
        piece.slot.find((e) => e.placement == component)?.value == false
      )
        res++;
    });
    return res;
  }
  return (
    <>
      {uniqueMainstats.map((stat, index) => (
        <td key={index} colSpan={colSpans[index]}>
          {getTruesByComponent(rowData, component, stat)}
        </td>
      ))}
    </>
  );
};

const ReqTableBodyDetailed = ({
  rowData,
  component,
}: {
  rowData: [AlgoPiece, Unit][];
  component: SlotPlacement;
}) => {
  return (
    <>
      {rowData.map((row, indRow) => (
        <ReqTableCell
          component={component}
          unit={row[1]}
          piece={row[0]}
          key={indRow}
        />
      ))}
    </>
  );
};

const ReqTableCell = ({
  component,
  unit,
  piece,
}: {
  component: SlotPlacement;
  unit: Unit;
  piece: AlgoPiece;
}) => {
  function getSlotValue(
    piece: AlgoPiece,
    placementToFind: SlotPlacement
  ): string {
    return piece.slot.find((slot) => slot.placement == placementToFind)?.value
      ? "true"
      : "false";
  }

  return (
    <td>
      {unit.name} {getSlotValue(piece, component)}
    </td>
  );
};

const ReqTableHeader = ({ colData }: { colData: AlgoMainStat[] }) => {
  return (
    <>
      {mergeDuplicates(colData).cols.map((col, indCol) => (
        <th key={indCol} colSpan={mergeDuplicates(colData).spans[indCol]}>
          {col}
        </th>
      ))}
    </>
  );
};

export default AlgoRequirementGroup;
