import { AlgoCategory, Unit, AlgoPiece, ALGOCATEGORY } from "@/interfaces/datamodel";

/**
 * same as Object.keys() but with generic type return
 */
export function getKeys<T extends object>(obj: T): Array<keyof T> {
  return Object.keys(obj) as Array<keyof T>
}

// TODO: better name
/**
 * get arrays of algo pieces from each section in the algo set of a unit
 * @param category <ALGOCATEGORY> algo type
 * @param unit
 * @returns array of algo pieces
 */
export function get_algo(category: AlgoCategory, unit: Unit): AlgoPiece[] {
  switch (category) {
    case ALGOCATEGORY.Offense: return unit?.current.algo.offense;
    case ALGOCATEGORY.Stability: return unit?.current.algo.stability;
    case ALGOCATEGORY.Special: return unit?.current.algo.special;
  }
}