export const QUERY_KEYS = {
  STORE_UNITS: 'store_units'
} as const;
export type QueryKeys = keyof typeof QUERY_KEYS;

export const MUTATE_KEYS = {
  NEW_UNIT: 'new_unit'
} as const;
export type MutateKeys = keyof typeof MUTATE_KEYS ;
// export function refetch
