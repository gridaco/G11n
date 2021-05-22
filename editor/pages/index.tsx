import React from "react";
import Editor from "../sections/editor";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { SceneLocalRepository, SceneRepositoryStore } from "../repositories";
import { StorableScene, SceneStoreService } from "@bridged.xyz/base-sdk";
import { useRecoilState } from "recoil";
import { targetSceneIdAtom } from "../states/preview-canvas.state";
import {
  DesignGlobalizationRepository,
  DesignGlobalizationRepositoriesStore,
} from "@bridged.xyz/base-sdk/lib/g11n/repository";
import { DefaultScaffoldLayoyt } from "../layouts/default-layout";

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

  useEffect(() => {
    if (sceneId && !sceneRepository) {
      console.log("fetching scene data");
      const service = new SceneStoreService("temp", "");
      service.fetchScene(sceneId).then((response) => {
        console.log("response", response);
        const scene = response.data.data as StorableScene;
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
    <DefaultScaffoldLayoyt title={sceneRepository.scene.name}>
      <Editor key={sceneRepository?.id} sceneId={sceneId} />
    </DefaultScaffoldLayoyt>
  );
}
