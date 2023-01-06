import { AlgoCategory, Unit, AlgoPiece, ALGOCATEGORY, LoadoutType } from "@/interfaces/datamodel";

/**
 * same as Object.keys() but with generic type return
 */
export function getKeys<T extends object>(obj: T): Array<keyof T> {
  return Object.keys(obj) as Array<keyof T>
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
