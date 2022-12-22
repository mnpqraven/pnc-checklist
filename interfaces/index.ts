export type User = {
  id: string,
  number: number
}

export type ImportChunk = {
  schema: string,
  database: Database,
  units: Unit[]
}
export type Database = {
  skill: SkillCurrency,
  coin: number
}
export type Unit = {
  name: string,
  class: Class,
  current: Loadout,
  goal: Loadout,
}

export const CLASS = {
  Guard: "Guard",
  Warrior: "Warrior",
  Sniper: "Sniper",
  Specialist: "Specialist",
  Medic: "Medic"
} as const;
export type Class = keyof typeof CLASS

export type Loadout = {
  skill_level?: UnitSkill,
  algo: AlgoSet,
}
export type UnitSkill = {
  passive: number,
  auto: number
}
export type AlgoSet = {
  offense: AlgoPiece[],
  stability: AlgoPiece[],
  special: AlgoPiece[],
}
export type AlgoPiece = {
  name: Algorithm,    // "name"
  stat: AlgoMainStat, // "stat"
  slot: number[]
}
export const ALGORITHM = {
  LowerLimit: "Lower Limit",
  Feedforward: "Feedforward",
  Deduction: "Deduction",
  Progression: "Progression",
  DataRepair: "Data Repair",
  MLRMatrix: "MLR Matrix",
  Encapsulate: "Encapsulate",
  Iteration: "Iteration",
  Perception: "Perception",
  Overflow: "Overflow",
  Rationality: "Rationality",
  Convolution: "Convolution",
  Inspiration: "Inspiration",
  LoopGain: "Loop Gain",
  SVM: "S.V.M",
  Paradigm: "Paradigm",
  DeltaV: "Delta V",
  Cluster: "Cluster",
  Stratagem: "Stratagem",
  BLANK: "BLANK"
} as const;
export type Algorithm = keyof typeof ALGORITHM

export enum AlgoMainStat {
  Hashrate,
  HashratePercent,
  Atk,
  AtkPer,
  Health,
  HealthPercent,
  Haste,
  HealInc,
  BLANK, // null
}
export type SkillCurrency = {
  token: number,
  pivot: number,
}