import type { EmpowerUnit } from "./types";
import { UNIT_1 } from "./units-1";
import { UNIT_2, UNIT_3 } from "./units-2";
import { UNIT_4, UNIT_5 } from "./units-3";
import { UNIT_6, UNIT_7 } from "./units-4";
import { UNIT_8, UNIT_9, UNIT_10 } from "./units-5";

export const UNITS: EmpowerUnit[] = [
  UNIT_1,
  UNIT_2,
  UNIT_3,
  UNIT_4,
  UNIT_5,
  UNIT_6,
  UNIT_7,
  UNIT_8,
  UNIT_9,
  UNIT_10,
];

export function unitByNumber(n: number): EmpowerUnit | undefined {
  return UNITS.find((unit) => unit.n === n);
}
