export const IVK = {
  ALGORITHM_ALL: "algorithm_all",
  ALGO_SET_NEW: "algo_set_new",
  ALGO_SET_FILL: "algo_set_fill",
  ALGO_PIECE_NEW: "algo_piece_new",
  ALGO_SLOTS_COMPUTE: "algo_slots_compute",
  DEFAULT_SLOT_SIZE: "default_slot_size",
  MAIN_STAT_ALL: "main_stat_all",
  PRINT_ALGO: "print_algo",
  PRINT_MAIN_STATS: "print_main_stats",
  PRINT_MAIN_STAT: "print_main_stat",
  GET_NEEDED_RSC: "get_needed_rsc",
  UPDATE_CHUNK: "update_chunk",
  ENUM_LS: "enum_ls",
  REQUIREMENT_SLV: "requirement_slv",
  REQUIREMENT_LEVEL: "requirement_level",
  REQUIREMENT_NEURAL: "requirement_neural",
  REQUIRMENT_NEURAL_KITS: "requirment_neural_kits",
  REQUIREMENT_WIDGET: "requirement_widget",
  REQUIREMENT_ALGO_STORE: "requirement_algo_store",
  ALGO_REQ_FULFILLED: "algo_req_fulfilled",
  VIEW_LOCKER: "view_locker",
  REMOVE_KC: "remove_kc",
  CLEAR_OWNERLESS: "clear_ownerless",
  IMPORT: "import",
  EXPORT: "export",
  SET_DEFAULT_FILE: "set_default_file",
  GET_ALGO_DB: "get_algo_db",
  GET_BONUSES: "get_bonuses",
  GET_ALGO_BY_DAYS: "get_algo_by_days",
  GET_UNITS: "get_units",
  NEW_UNIT: "new_unit",
  DELETE_UNIT: "delete_unit",
  SAVE_UNITS: "save_units",
  GET_UNIT: "get_unit",
  VALIDATE_SLOTS: "validate_slots",
  VALIDATE: "validate",
  GET_TAURI_VERSION: "get_tauri_version",
  ALGO_REQ_GROUP_PIECE: "algo_req_group_piece",
} as const;
export type Ivk = keyof typeof IVK;