/**
 * same as Object.keys() but with generic type return
 */
export default function getKeys<T extends object>(obj: T): Array<keyof T> {
  return Object.keys(obj) as Array<keyof T>
}