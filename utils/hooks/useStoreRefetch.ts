import { rspc } from "@/components/Providers/ClientProviders";

export const useStoreRefresh = () => {
  const { refetch: refreshSlv } = rspc.useQuery(["unitSkills.get"]);
  const { refetch: refreshLoadout } = rspc.useQuery(["loadouts.get"]);
  const { refetch: refreshPieces } = rspc.useQuery(["algoPieces.get"]);
  const { refetch: refreshSlots } = rspc.useQuery(["slots.get"]);
  const { refetch: refreshUnits } = rspc.useQuery(["units.get"]);

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
