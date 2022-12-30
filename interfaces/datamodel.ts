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
export const LOADOUTTYPE = {
  current: 'current',
  goal: 'goal'
} as const;
export type LoadoutType = keyof typeof LOADOUTTYPE

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
  slot: boolean[]
}

// can use values from Display impl in rust backend
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
} as const;
export type Algorithm = keyof typeof ALGORITHM

export const ALGOMAINSTAT = {
  Hashrate: "Hashrate",
  HashratePercent: "Hashrate %",
  Atk: "Attack",
  AtkPercent: "Atk %",
  Health: "Health",
  HealthPercent: "Health %",
  Haste: "Haste",
  CritRate: "Critical Rate",
  CritDmg: "Critical Damage",
  DamageInc: "Damage Increase",
  Dodge: "Dodge",
  HealInc: "Heal Increase",
  DamageReduction: "Damage Reduction",
  Def: "Defense",
  DefPercent: "Defense %",
  OperandDef: "Operand Def",
  OperandDefPercent: "Operand Def %",
} as const
export type AlgoMainStat = keyof typeof ALGOMAINSTAT

export type SkillCurrency = {
  token: number,
  pivot: number,
}
export const ALGOCATEGORY = {
  Offense: "Offense",
  Stability: "Stability",
  Special: "Special",
} as const
export type AlgoCategory = keyof typeof ALGOCATEGORY

export type AlgoTypeDb = {
  category: AlgoCategory,
  algos: Algorithm
}

export type GrandResource = {
  slv_token: number,
  slv_pivot: number,
  coin: number
}