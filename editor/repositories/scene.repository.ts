import { StorableLayer } from "@base-sdk/base";
import { SceneRecord } from "@base-sdk/scene-store";

// NOT USING
export class SceneRepositoryStore {
  static repositories: Array<SceneLocalRepository> = [];

  static find(scene: string): SceneLocalRepository {
    return this.repositories.find((r) => r.scene.id == scene)!;
  }

  static make(scene: SceneRecord) {
    const newRepository = new SceneLocalRepository(scene);
    this.repositories.push(newRepository);
    console.log("made sceneRepository", newRepository);
    return newRepository;
  }
}

export class SceneLocalRepository {
  readonly id: string;
  constructor(readonly scene: SceneRecord) {
    this.id = scene.id!;
  }

  layer(id: string): StorableLayer {
    // TODO: not tested
    return this.scene.raw["layers"].find((e) => e.nodeId == id)!;
  }
}
