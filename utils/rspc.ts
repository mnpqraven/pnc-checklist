import { createClient } from "@rspc/client";
import { Procedures } from "@/src-tauri/bindings/rspc";
import { TauriTransport } from "@rspc/tauri";

export const rspcClient = createClient<Procedures>({
  transport: new TauriTransport(),
});
