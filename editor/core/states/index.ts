export interface EditorState {
  scene: any;
  selection: string;
  locale: string;
  locales: string[];
  target?: {
    id: string;
    value: string;
  };
}
