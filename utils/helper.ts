import { Algorithm, Class } from "@/src-tauri/bindings/enums";
import { ChangeEvent } from "react";

/**
 * same as Object.keys() but with generic type return
 */
export function getKeys<T extends object>(obj: T): Array<keyof T> {
  return Object.keys(obj) as Array<keyof T>;
}

/**
 * converts the given date to an ISO date string
 * @param d date to convert
 * @returns ISO-compliant date string in UTC timezone
 */
export function parse_date_iso(d: Date): string {
  const year = d.getFullYear();
  let month = String(d.getMonth() + 1).padStart(2, "0");
  let day = String(d.getDate()).padStart(2, "0");
  // TODO: config for different server
  // 20:00:00 JP 21:00:00 CN
  return `${year}-${month}-${day}T13:00:00Z`;
}

/**
 * Whether if the given date is before or after the time this function is ran
 * @param d date to compare to
 */
export function date_passed(d: Date): boolean {
  return new Date() > new Date(parse_date_iso(d));
}

export function algo_src(item: Algorithm): string {
  return `/algos/${item.toLowerCase()}.png`;
}

export function class_src(item: Class): string {
  return `/class/${item.toLowerCase()}.png`;
}

export function deep_eq(a: any, b: any): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function deduplicate<T>(input: Iterable<T>): T[] {
  return [...new Set(input)];
}

export function isEmpty(str: string | undefined) {
  if (str === "" || typeof str === "undefined") return true;
  return false;
}

export function getValue(e: ChangeEvent<HTMLInputElement>): number {
  let value = parseInt(e.target.value);
  return value;
}
