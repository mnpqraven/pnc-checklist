import { Procedures } from "@/src-tauri/bindings/rspc";

export interface Id {
  id: string;
}

type Extends<T, U extends T> = U;
type ArrayType<Type> = Type extends Array<infer X extends Id> ? X : never;
export type PassableStructs = Extends<
  Id,
  ArrayType<Procedures["queries"]["result"]>
>;

export type DirtyOnTopActionables<T extends PassableStructs> =
  | {
      name: "CONFORM_WITH_STORE";
      store: Array<PassableStructs>;
    }
  | {
      name: "SET";
      store: Array<PassableStructs>;
      dirties: Array<T>;
    };

export type DirtyListActionables<T extends PassableStructs> =
  | {
      name: "UPDATE";
      store: Array<PassableStructs>;
      to: T;
    }
  | {
      name: "CLEAR";
      store: Array<PassableStructs>;
    };

// type KeysOfUnion<T> = T extends T ? keyof T : never;
export type CurrentActionables<T extends PassableStructs> = {
  name: "UPDATE";
  to: T;
  constraint: keyof T;
  equals: string; // value to compare
};
