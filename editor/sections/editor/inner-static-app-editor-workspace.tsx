import React from "react";
import { useRecoilValue } from "recoil";
import { DesignGlobalizationRepositoriesStore } from "@bridged.xyz/base-sdk/lib/g11n/repository";
import { targetLayerSelector } from "../../states";
import SceneKeyEditor from "../scene-key-editor";
import SingleKeyEditor from "../key-editor";
import { SceneRepositoryStore } from "../../repositories";
import CanvasStage from "../../components/canvas/stage";
import { InnerEditorWorkspace } from "./inner-editor-workspace";

interface AppEditorProps {
  projectId?: string;
  sceneId: string;
}

export function InnerStaticAppEditorWorkspace(props: AppEditorProps) {
  const targetLayer = useRecoilValue(targetLayerSelector);

  const editorSwitch = (): boolean => {
    return targetLayer !== undefined;
  };

  const repository = DesignGlobalizationRepositoriesStore.find(props.sceneId);
  const sceneRepository = SceneRepositoryStore.find(props.sceneId);

  const EditorBody = () => {
    return editorSwitch() ? (
      <SingleKeyEditor key={targetLayer?.nodeId} repository={repository} />
    ) : (
      <SceneKeyEditor repository={repository} />
    );
  };
  return (
    <InnerEditorWorkspace
      canvas={<CanvasStage sceneRepository={sceneRepository} />}
      editor={<EditorBody />}
    ></InnerEditorWorkspace>
  );
}
