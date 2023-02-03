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
  projectId?: string;
  projectName?: string;
  locales?: string[];
  selectedLocale?: string;
  textSets?: TextSet[];
  selectedTextSet?: TextSet;
  targetLayer?: Layer;
}

interface TextSet {
  id?: string;
  key?: string;
  value?: { [locale: string]: string };
}

interface Layer {
  id: string;
  value?: string;
}

interface EditorState {
  data: EditorData | null;
}

const editorInitialState: EditorState = {
  data: null,
};

interface NewProjectData {
  projectId?: string;
  projectName?: string;
  projectType?: string;
  baseUrl?: string;
  urls?: string[];
  locales?: string[];
  defaultLocale?: string;
}

interface NewProjectState {
  data: NewProjectData | null;
}

const newProjectInitialState: NewProjectState = {
  data: {
    projectType: "aw",
    locales: [],
    urls: [],
  },
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

const newProjectPageSlice = createSlice({
  name: "newProject",
  initialState: newProjectInitialState,
  reducers: {
    setNewProjectData(state, action: PayloadAction<NewProjectData>) {
      state.data = { ...state.data, ...action.payload };
    },
  },
});

const makeStore = () => {
  const store = configureStore({
    reducer: {
      editor: editorPageSlice.reducer,
      newProject: newProjectPageSlice.reducer,
    },
    devTools: true,
  });

  return store;
};

const store = makeStore();

export default store;
export type RootState = ReturnType<typeof store.getState>;
export const { setProjectData } = editorPageSlice.actions;
export const { setNewProjectData } = newProjectPageSlice.actions;
