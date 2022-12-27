import type { EditorState } from "core/states";
import produce from "immer";
import { CreateNewSetAction, Action, RemoveSetAction } from "../actions";
// import { historyReducer } from "./history";

export function editorReducer(state: EditorState, action: Action): EditorState {
  switch (action.type) {
    case "sets/new": {
      return produce(state, (draft) => {
        const {} = <CreateNewSetAction>action;
        //
      });
    }
    // todo: move to workspace state
    case "sets/remove": {
      const {} = <RemoveSetAction>action;

      return produce(state, (draft) => {
        //
      });
    }

    // todo: move to workspace state
    case "sets/change-key": {
      return produce(state, (draft) => {
        //
      });
    }

    // default fallback - use history reducer
    case "redo":
    case "undo":
    default: {
      return produce(state, (draft) => {});
    }
  }
}
