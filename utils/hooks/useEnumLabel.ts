import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/tauri";

export const useEnumLabel = (labelPayload?: {
  method: string;
  payload: string;
}): string[] => {
  let label: string[] = [];

  if (labelPayload) {
    const labelQuery = useQuery({
      queryKey: ["label", labelPayload.method, labelPayload.payload],
      queryFn: () =>
        invoke<string[]>(labelPayload.method, {
          payload: labelPayload.payload,
        }),
    });

    if (labelQuery.isSuccess) label = labelQuery.data;
  }
  return label;
};
