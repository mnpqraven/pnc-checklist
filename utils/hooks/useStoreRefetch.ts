import { rspc } from "@/components/Providers/ClientProviders";

export const useStoreRefresh = () => {
  const { refetch: refreshSlv } = rspc.useQuery(["skillLevelsByUnitIds", null]);
  const { refetch: refreshLoadout } = rspc.useQuery(["loadoutByUnitId", null]);
  const { refetch: refreshPieces } = rspc.useQuery([
    "algoPiecesByLoadoutId",
    null,
  ]);
  const { refetch: refreshSlots } = rspc.useQuery([
    "slotsByAlgoPieceIds",
    null,
  ]);
  const { refetch: refreshUnits } = rspc.useQuery(["getUnits"]);

  function refreshAll() {
    refreshSlv();
    refreshLoadout();
    refreshPieces();
    refreshSlots();
    refreshUnits();
  }
  return {
    refreshSlv,
    refreshLoadout,
    refreshPieces,
    refreshSlots,
    refreshUnits,
    refreshAll,
  };
};
