import {
  configureStore,
  PayloadAction,
  createSlice,
  combineReducers,
  ThunkAction,
  Action,
} from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

interface EditorData {
  id?: string;
  locales?: string[];
  selectedLocale?: string;
  textSets?: TextSet[];
  selectedTextSet?: TextSet;
}

interface TextSet {
  id?: string;
  key?: string;
  value?: { [locale: string]: string };
}

interface EditorState {
  data: EditorData | null;
}

const editorInitialState: EditorState = {
  data: null,
};

const editorPageSlice = createSlice({
  name: "editor",
  initialState: editorInitialState,
  reducers: {
    setProjectData(state, action: PayloadAction<EditorData>) {
      state.data = { ...state.data, ...action.payload };
    },
  },
});

const makeStore = () => {
  const store = configureStore({
    reducer: {
      editor: editorPageSlice.reducer,
    },
    devTools: true,
  });

  return store;
};

const store = makeStore();

export default store;
export type RootState = ReturnType<typeof store.getState>;
export const { setProjectData } = editorPageSlice.actions;
