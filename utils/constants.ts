import { NEURALEXPANSION, Unit } from "@/interfaces/datamodel";

export const UNITEXAMPLE: Unit = {
  name: "",
  class: "Guard",
  current: {
    skill_level: {
      passive: 1,
      auto: 1
    },
    algo: {
      offense: [],
      stability: [],
      special: []
    },
    level: 1,
    neural: NEURALEXPANSION.Three
  },
  goal: {
    skill_level: {
      passive: 1,
      auto: 1
    },
    algo: {
      offense: [],
      stability: [],
      special: []
    },
    level: 1,
    neural: NEURALEXPANSION.Three
  }
}