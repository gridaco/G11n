export type Action = CreateNewSetAction;
export type ActionType = Action["type"];

export type CreateNewSetAction = {
  type: "sets/new";
};

export type RemoveSetAction = {
  type: "sets/remove";
};

export type ChangeKeyAction = {
  type: "sets/change-key";
};
