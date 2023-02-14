// import "@testing-library/jest-dom";
// import { mockIPC } from "@tauri-apps/api/mocks";
// import {
//   AlgoCategory,
//   AlgoMainStat,
//   Algorithm,
// } from "./src-tauri/bindings/enums";
// import { Unit } from "@/src-tauri/bindings/structs";
//
// beforeEach(() => {
//   mockIPC((cmd, args) => {
//     switch (cmd) {
//       case "enum_ls":
//         switch (args.name) {
//           case "Class":
//             return ["Guard", "Medic", "Sniper", "Warrior", "Specialist"];
//           case "AlgoCategory":
//             return ["Offense", "Stability", "Special"];
//         }
//         return ["mon"];
//       case "dev_set":
//         return "async";
//       case "view_store_units":
//         return [MOCK_CROQUE, MOCK_HUBBLE];
//       case "get_algo_db": {
//         let t: [AlgoCategory, Algorithm[]][] = [
//           [
//             "Offense",
//             [
//               "LowerLimit",
//               "Feedforward",
//               "Deduction",
//               "Progression",
//               "DataRepair",
//               "MLRMatrix",
//               "Stack",
//               "LimitValue",
//             ],
//           ],
//           [
//             "Stability",
//             [
//               "Encapsulate",
//               "Iteration",
//               "Perception",
//               "Overflow",
//               "Rationality",
//               "Connection",
//               "Reflection",
//               "Resolve",
//             ],
//           ],
//           [
//             "Special",
//             [
//               "Inspiration",
//               "LoopGain",
//               "SVM",
//               "Paradigm",
//               "DeltaV",
//               "Convolution",
//               "Cluster",
//               "Stratagem",
//               "Exploit",
//             ],
//           ],
//         ];
//         return t;
//       }
//       case "main_stat_all": {
//         let t: AlgoMainStat[][] = [
//           [
//             "Hashrate",
//             "HashratePercent",
//             "Atk",
//             "AtkPercent",
//             "Health",
//             "HealthPercent",
//             "Haste",
//           ],
//           [
//             "PhysPen",
//             "PhysPenPercent",
//             "OperandPen",
//             "OperandPenPercent",
//             "CritRate",
//             "CritDmg",
//             "DamageInc",
//             "Dodge",
//             "HealInc",
//           ],
//           [
//             "Def",
//             "DefPercent",
//             "OperandDef",
//             "OperandDefPercent",
//             "PostBattleRegen",
//           ],
//         ];
//         return t;
//       }
//       case "algo_slots_compute": {
//         return [false, false, false];
//       }
//       case "validate_slots":
//         return null;
//       case "print_algo":
//         switch (args.payload) {
//           case "Offense":
//             return [
//               "LowerLimit",
//               "Feedforward",
//               "Deduction",
//               "Progression",
//               "DataRepair",
//               "MLRMatrix",
//               "Stack",
//               "LimitValue",
//             ];
//           case "Stability":
//             return [
//               "Encapsulate",
//               "Iteration",
//               "Perception",
//               "Overflow",
//               "Rationality",
//               "Connection",
//               "Reflection",
//               "Resolve",
//             ];
//           case "Special":
//             return [
//               "Inspiration",
//               "LoopGain",
//               "SVM",
//               "Paradigm",
//               "DeltaV",
//               "Convolution",
//               "Cluster",
//               "Stratagem",
//               "Exploit",
//             ];
//         }
//       case "print_main_stat":
//         return [];
//     }
//   });
// });
//
// export const MOCK_CROQUE: Unit = {
//   name: "Croque",
//   class: "Guard",
//   current: {
//     skill_level: { auto: 1, passive: 1 },
//     level: 20,
//     neural: "Three",
//     frags: 20,
//     algo: {
//       offense: [
//         {
//           name: "LowerLimit",
//           stat: "Hashrate",
//           slot: [true, false, false],
//         },
//         {
//           name: "LowerLimit",
//           stat: "Hashrate",
//           slot: [false, true, false],
//         },
//       ],
//       stability: [
//         { name: "Encapsulate", stat: "Def", slot: [false, true, true] },
//       ],
//       special: [],
//     },
//   },
//   goal: {
//     skill_level: { auto: 10, passive: 10 },
//     level: 60,
//     neural: "Five",
//     frags: null,
//     algo: {
//       offense: [
//         {
//           name: "Progression",
//           stat: "HashratePercent",
//           slot: [true, true, false],
//         },
//       ],
//       stability: [
//         {
//           name: "Overflow",
//           stat: "DefPercent",
//           slot: [true, true, true],
//         },
//       ],
//       special: [
//         {
//           name: "Stratagem",
//           stat: "DefPercent",
//           slot: [true, true, false],
//         },
//       ],
//     },
//   },
// };
//
// export const MOCK_HUBBLE: Unit = {
//   name: "Hubble",
//   class: "Sniper",
//   current: {
//     skill_level: { auto: 1, passive: 1 },
//     level: 20,
//     neural: "Three",
//     frags: 20,
//     algo: {
//       offense: [
//         {
//           name: "Feedforward",
//           stat: "Atk",
//           slot: [true, true, false],
//         },
//       ],
//       stability: [
//         { name: "Encapsulate", stat: "Def", slot: [false, true, true] },
//       ],
//       special: [
//         { name: "DeltaV", stat: "OperandPen", slot: [true, false, false] },
//       ],
//     },
//   },
//   goal: {
//     skill_level: { auto: 10, passive: 10 },
//     level: 60,
//     neural: "Five",
//     frags: null,
//     algo: {
//       offense: [
//         {
//           name: "MLRMatrix",
//           stat: "AtkPercent",
//           slot: [true, true, true],
//         },
//       ],
//       stability: [
//         {
//           name: "Encapsulate",
//           stat: "Health",
//           slot: [true, true],
//         },
//       ],
//       special: [
//         {
//           name: "Paradigm",
//           stat: "CritDmg",
//           slot: [true, true, false],
//         },
//       ],
//     },
//   },
// };
export {}
