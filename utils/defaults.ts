import { Day, NeuralExpansion } from "@/src-tauri/bindings/enums";
import {
  AlgoSet,
  GrandResource,
  Level,
  NeuralFragment,
  Unit,
  UnitSkill,
} from "@/src-tauri/bindings/structs";

/// not the same as the array from backend, this is shift right by 2
export const DEFAULT_DAYS: Day[] = [
  "Sat",
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
];
export const DEFAULT_GRAND_RESOURCE: GrandResource = {
  skill: { token: 0, pivot: 0 },
  coin: 0,
  exp: 0,
  neural_kits: 0,
  widgets: [],
};

export const DEFAULT_UNITSKILL: UnitSkill = {
  passive: 1,
  auto: 1,
};
export const DEFAULT_LEVEL: Level = 1;
export const DEFAULT_NEURAL_EXPANSION: NeuralExpansion = "Three";
export const DEFAULT_NEURAL_FRAGMENT: NeuralFragment = 0;
export const DEFAULT_ALGO_SET: AlgoSet = {
  offense: [],
  stability: [],
  special: [],
};
export const DEFAULT_UNIT: Unit = {
  name: "Croque",
  class: "Guard",
  current: {
    skill_level: DEFAULT_UNITSKILL,
    level: DEFAULT_LEVEL,
    neural: DEFAULT_NEURAL_EXPANSION,
    frags: DEFAULT_NEURAL_FRAGMENT,
    algo: DEFAULT_ALGO_SET,
  },
  goal: {
    skill_level: { auto: 10, passive: 10 },
    level: 60,
    neural: "Five",
    frags: null,
    algo: {
      offense: [
        {
          name: "Deduction",
          stat: "HashratePercent",
          slot: [
            { placement: "One", value: true },
            { placement: "Two", value: true },
          ],
        },
      ],
      stability: [
        {
          name: "Overflow",
          stat: "DefPercent",
          slot: [
            { placement: "One", value: true },
            { placement: "Two", value: true },
            { placement: "Three", value: true },
          ],
        },
      ],
      special: [
        {
          name: "Stratagem",
          stat: "DefPercent",
          slot: [
            { placement: "One", value: true },
            { placement: "Two", value: true },
          ],
        },
      ],
    },
  },
};

export const THEME_CLASSES = {
  light: "light-theme",
  dark: "dark-theme",
  entropic: "entropic-theme",
} as const;
