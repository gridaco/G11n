import React from "react";
// import { InnerEditorWorkspace } from "../sections/editor/inner-editor-workspace";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { SceneLocalRepository, SceneRepositoryStore } from "repositories";
import { SceneStoreService, SceneRecord } from "@base-sdk/scene-store";
import { useRecoilState } from "recoil";
import { targetSceneIdAtom } from "states/preview-canvas.state";
import {
  DesignGlobalizationRepository,
  DesignGlobalizationRepositoriesStore,
} from "@base-sdk/g11n";
import { DefaultScaffoldLayoyt } from "layouts/default-layout";
import { InnerStaticAppEditorWorkspace } from "scaffolds/editor/inner-static-app-editor-workspace";
import { makeService } from "services/scene-store";

export default function Home() {
  const router = useRouter();

  const { query } = router;
  const sceneId: string = query.scene as string;
  const [sceneRepository, setScreenRepository] = useState<
    SceneLocalRepository
  >();
  const [
    desingGlobalizationRepository,
    setdesingGlobalizationRepository,
  ] = useState<DesignGlobalizationRepository>();
  const [targetSceneId, setTargetSceneId] = useRecoilState(targetSceneIdAtom);

  const service = React.useMemo(() => makeService(), []);

  useEffect(() => {
    if (sceneId && !sceneRepository) {
      console.log("fetching scene data");

      service.get(sceneId).then((response) => {
        console.log("response", response);
        const scene = response;
        const sceneRepository = SceneRepositoryStore.make(scene);
        const desingGlobalizationRepository = DesignGlobalizationRepositoriesStore.make(
          "temp",
          scene.id!
        );
        setTargetSceneId(sceneRepository.id);
        setScreenRepository(sceneRepository);
        setdesingGlobalizationRepository(desingGlobalizationRepository);
      });
    }
  });

  if (!sceneRepository) {
    return <DefaultScaffoldLayoyt loading />;
  }

  return (
    <DefaultScaffoldLayoyt title={sceneRepository.scene.rawname}>
      <InnerStaticAppEditorWorkspace
        key={sceneRepository?.id}
        sceneId={sceneId}
      />
    </DefaultScaffoldLayoyt>
  );
}
