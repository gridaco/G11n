import {
  configureStore,
  PayloadAction,
  createSlice,
  combineReducers,
  ThunkAction,
  Action,
} from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

interface ProjectData {
  locale: string;
  locales: string[];
  textSet: TextSet;
  textSets: TextSet[];
}

interface TextSet {
  id: string;
  key: string;
  value: { [locale: string]: string };
}

interface EditorState {
  data: ProjectData | null;
}

const editorInitialState: EditorState = {
  data: null,
};

const editorPageSlice = createSlice({
  name: "editor",
  initialState: editorInitialState,
  reducers: {
    setProjectData(state, action: PayloadAction<ProjectData>) {
      state.data = action.payload;
    },
  },
});

const reducers = {
  editor: editorPageSlice.reducer,
};
const reducer = combineReducers(reducers);

const makeStore = () => {
  const store = configureStore({
    reducer,
    devTools: true,
  });

  return store;
};

const store = makeStore();

export default store;
export type RootState = ReturnType<typeof store.getState>;
export const { setProjectData } = editorPageSlice.actions;
