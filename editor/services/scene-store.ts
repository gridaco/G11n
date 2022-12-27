import { SceneStoreService } from "@base-sdk/scene-store";

export function makeService() {
  if (typeof window !== "undefined") {
    if (process.env.NODE_ENV == "development") {
      // if location == webdev.grida.co
      if (window.location.hostname == "webdev.grida.co") {
        return new SceneStoreService({
          type: "auto-browser-otp",
        });
      }
      // ONLY USED FOR DEVELOPMENT
      return new SceneStoreService({
        type: "token",
        token: window.localStorage.getItem("contributors.grida.co/token"),
      });
    } else {
      return new SceneStoreService({
        type: "auto-browser-otp",
      });
    }
  }
}
