// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { Algorithm } from "..\\enums\\Algorithm";
import type { Bonus } from "..\\enums\\Bonus";
import type { Day } from "..\\enums\\Day";

export interface ResourceByDay { day: Day, coin: Bonus | null, exp: Bonus | null, skill: Bonus | null, class: Bonus | null, algos: Array<Algorithm>, }