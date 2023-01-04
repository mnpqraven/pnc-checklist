import { Class } from "./datamodel"

export type DatabaseRequirement = {
  unit_req: UnitRequirement[]
}
export type UnitRequirement = {
  skill: SkillResourceRequirement,
  neural: NeuralResourceRequirement,
  level: LevelRequirement,
  breakthrough: WidgetResourceRequirement,
}
export type LevelRequirement = {
  exp: Exp
}
export type SkillResourceRequirement = {
  token: number
  pivot: number
  coin: number
}
export type NeuralResourceRequirement = {
  frags: number,
  coin: Coin
}
export type WidgetResourceRequirement = {
  widget: WidgetResource,
  coin: Coin
}
export type WidgetResource = {
  class: Class,
  widget_inventory: number[]
}
export type Coin = number
export type Exp = number
