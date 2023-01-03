import { AlgoCategory, Unit, AlgoPiece, ALGOCATEGORY, LoadoutType, LOADOUTTYPE } from "@/interfaces/datamodel";

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
export function get_algo(category: AlgoCategory, unit: Unit, loadout_type: LoadoutType): AlgoPiece[] {
  switch (category) {
    case ALGOCATEGORY.Offense: switch (loadout_type) {
      case LOADOUTTYPE.current:
        return unit.current.algo.offense;
      case LOADOUTTYPE.goal:
        return unit.goal.algo.offense;
    }
    case ALGOCATEGORY.Stability: switch (loadout_type) {
      case LOADOUTTYPE.current:
        return unit.current.algo.stability;
      case LOADOUTTYPE.goal:
        return unit.goal.algo.stability;
    }
    case ALGOCATEGORY.Special: switch (loadout_type) {
      case LOADOUTTYPE.current:
        return unit.current.algo.special;
      case LOADOUTTYPE.goal:
        return unit.goal.algo.special;
    }
  }
}

export function algo_src(item: string): string {
  return `algos/${item.toLowerCase()}.png`
}

export function parse_date_iso(d: Date): string {
  const year = d.getFullYear();
  let month = String(d.getMonth() + 1).padStart(2, "0");
  let day = String(d.getDate()).padStart(2, "0");
  // TODO: 20:00:00 JP 21:00:00 CN
  return `${year}-${month}-${day}T13:00:00Z`;
}
export function date_passed(d: Date): boolean {
  return new Date() > new Date(parse_date_iso(d))
}