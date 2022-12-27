import { SceneStoreService } from "@base-sdk/scene-store";

export function makeService() {
  if (process.env.NODE_ENV == "development") {
    // ONLY USED FOR DEVELOPMENT
    // ssr
    if (typeof window !== "undefined") {
      return new SceneStoreService({
        type: "token",
        token: window.localStorage.getItem("contributors.grida.co/token"),
      });
    }
  } else {
    return new SceneStoreService({
      type: "auto-browser-otp",
    });
  }
}
