import { deep_eq } from "@/utils/helper";
import { castDraft, Draft } from "immer";
import { Updater } from "use-immer";

export interface Id {
  id: string;
}

export type DirtyOnTopActionables<T extends Id> =
  | {
      name: "CONFORM_WITH_STORE";
      store: Array<T>;
    }
  | {
      name: "SET";
      store: Array<T>;
      dirties: Array<T>;
    };

// TODO: evaluate type
export type DirtyListActionables<T extends Id> =
  | {
      name: "UPDATE";
      store: Array<T>;
      to: T;
    }
  | {
      name: "CLEAR";
      store: Array<T>;
    };

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type CurrentActionables<T> = {
  name: "UPDATE";
  to: T;
  constrain: KeysOfUnion<T>
  equals: string; // value to compare
};

export function currentReducer<T>(
  draft: Array<Draft<T>>,
  action: CurrentActionables<T>
) {
  switch (action.name) {
    case "UPDATE": {
      if (action.constrain != undefined) {
        let ind = draft.findIndex(
          (e) => e[action.constrain as keyof Draft<T>] == action.equals
        );
        draft[ind] = castDraft(action.to);
      }
      return draft;
    }
  }
}

export function dirtyListReducer<T extends Id>(
  draft: Draft<T>[],
  action: DirtyListActionables<T>
) {
  switch (action.name) {
    case "UPDATE": {
      let bucketIndex: number = draft.findIndex((e) => e.id == action.to.id);

      if (bucketIndex === -1) {
        draft.push(castDraft(action.to));
      } else if (
        deep_eq(
          action.store[action.store.findIndex((e) => e.id == action.to.id)],
          action.to
        )
      ) {
        draft.splice(bucketIndex, 1);
      } else {
        let ind = draft.findIndex((e) => e.id == action.to.id);
        draft[ind] = castDraft(action.to);
      }
      return draft;
    }
    case "CLEAR": {
      let excludeIds: string[] = [];
      draft.forEach((dirty) => {
        let find = action.store.find((e) => e.id == dirty.id);
        if (find && deep_eq(find, dirty)) {
          excludeIds.push(dirty.id);
        }
      });
      draft = draft.filter((e) => !excludeIds.includes(e.id));
      return draft;
    }
  }
}

export const dirtyOnTopReducer = <T extends Id>(
  draft: Draft<T>[],
  action: DirtyOnTopActionables<T>
) => {
  switch (action.name) {
    case "CONFORM_WITH_STORE": {
      let beforeIds = draft.map((e) => e.id);
      let nextIds = action.store.map((e) => e.id);
      // https://stackoverflow.com/questions/1187518/how-to-get-the-difference-between-two-arrays-in-javascript
      const intersecOrDiff = nextIds.length > draft.length;
      let diff = nextIds.filter((e) =>
        intersecOrDiff ? !beforeIds.includes(e) : beforeIds.includes(e)
      );
      if (intersecOrDiff)
        action.store
          .filter((e) => diff.includes(e.id))
          .forEach((item) => draft.push(castDraft(item)));
      else draft = draft.filter((e) => diff.includes(e.id));
      return draft;
    }
    case "SET": {
      let dirtyList = action.store.map((unit) => {
        if (action.dirties.map((e) => e.id).includes(unit.id))
          return action.dirties.find((e) => e.id == unit.id)!;
        return unit;
      });
      return dirtyList;
    }
  }
}
