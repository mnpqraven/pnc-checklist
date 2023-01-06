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
  skill_level: UnitSkill,
  algo: AlgoSet,
  level: number,
  neural: NeuralExpansion
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
  Connection: "Connection",
  Rationality: "Rationality",
  Convolution: "Convolution",
  Inspiration: "Inspiration",
  LoopGain: "Loop Gain",
  SVM: "S.V.M",
  Paradigm: "Paradigm",
  DeltaV: "Delta V",
  Cluster: "Cluster",
  Stratagem: "Stratagem",
  Stack: "Stack",
  LimitValue: "Limit Value",
  Reflection: "Reflection",
  Resolve: "Resolve",
  Exploit: "Exploit"
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
export const ALGOCATEGORY_LOWER = {
  offense: "offense",
  stability: "stability",
  special: "special",
} as const
export type AlgoCategoryLower = keyof typeof ALGOCATEGORY_LOWER

export type AlgoTypeDb = {
  category: AlgoCategory,
  algos: Algorithm[]
}

export type GrandResource = {
  skill: SkillCurrency,
  coin: number
}
export const NEURALEXPANSION = {
  One: "One",
  OneHalf: "OneHalf",
  Two: "Two",
  TwoHalf: "TwoHalf",
  Three: "Three",
  ThreeHalf: "ThreeHalf",
  Four: "Four",
  FourHalf: "FourHalf",
  Five: "Five",
} as const
export type NeuralExpansion = keyof typeof NEURALEXPANSION
export const DAY = {
  Mon: "Mon",
  Tue: "Tue",
  Wed: "Wed",
  Thu: "Thu",
  Fri: "Fri",
  Sat: "Sat",
  Sun: "Sun",
} as const;
export type Day = keyof typeof DAY;

export const Bonus = {
  Coin: "Coin",
  Exp: "Exp",
  Skill: "Skill",
}

export type ResourceByDay = {
  day: Day,
  coin: typeof Bonus.Coin | null,
  exp: typeof Bonus.Exp | null,
  skill: typeof Bonus.Skill | null,
  class: Class | null,
  algos: Algorithm[] | null
}
