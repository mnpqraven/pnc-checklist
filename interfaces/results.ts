// TODO:
export const UNITVALIDATIONERROR = {
  NameError: "NameError",
  SkillLevelError: "SkillLevelError",
  AlgorithmError: "AlgorithmError",
} as const;
export type UnitValidationError = keyof typeof UNITVALIDATIONERROR;
