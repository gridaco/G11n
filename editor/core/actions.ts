export type Action =
  | HistoryAction
  | CreateNewSetAction
  | RemoveSetAction
  | ChangeKeyAction;

export type HistoryAction =
  //
  | { type: "undo" }
  //
  | { type: "redo" };

export type EditorActionType = Action["type"];

export type CreateNewSetAction = {
  type: "sets/new";
};

export type RemoveSetAction = {
  type: "sets/remove";
};

export type ChangeKeyAction = {
  type: "sets/change-key";
};
