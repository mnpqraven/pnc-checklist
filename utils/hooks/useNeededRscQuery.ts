import { INVOKE_KEYS } from "@/src-tauri/bindings/invoke_keys";
import { GrandResource, WidgetResource } from "@/src-tauri/bindings/structs";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/tauri";
import { DEFAULT_GRAND_RESOURCE } from "../defaults";

export const useNeededRscQuery = () => {
  const neededRsc = useQuery({
    queryKey: [INVOKE_KEYS.GET_NEEDED_RSC],
    queryFn: () => invoke<GrandResource>(INVOKE_KEYS.GET_NEEDED_RSC),
    placeholderData: DEFAULT_GRAND_RESOURCE,
  });

  function processData(
    data: GrandResource = DEFAULT_GRAND_RESOURCE
  ): GrandResource {
    let noempty: WidgetResource[] = [];
    data.widgets.forEach(
      (byClass) =>
        byClass.widget_inventory.every((e) => e !== 0) && noempty.push(byClass)
    );
    return { ...data, widgets: noempty };
  }

  return {
    data: processData(neededRsc.data),
    isLoading: neededRsc.isLoading,
    isError: neededRsc.isError,
    isPlaceholderData: neededRsc.isPlaceholderData,
  };
};
