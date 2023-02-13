export const ENUM_TABLE = {
  Class: "Class",
  Algorithm: "Algorithm",
  Day: "Day",
  Bonus: "Bonus",
  AlgoMainStat: "AlgoMainStat",
  AlgoSubStat: "AlgoSubStat",
  AlgoCategory: "AlgoCategory",
  NeuralExpansion: "NeuralExpansion",
  LoadoutType: "LoadoutType",
  SlotPlacement: "SlotPlacement",
} as const;
 export type EnumTable = keyof typeof ENUM_TABLE;