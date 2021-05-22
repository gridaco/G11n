import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { DefaultScaffoldLayoyt } from "../../../layouts/default-layout";
import { InnerEditorWorkspace } from "../../../sections/editor/inner-editor-workspace";

const DEFAULT_GAMES_DEMO_REGISTRY_BASE =
  "https://bridged-service-demo.s3-us-west-1.amazonaws.com/";

/**
 * games configuration
 */
const DEFAULT_GAMES_DEMO_REGISTRY: {
  [key: string]: {
    device: string;
  };
} = {
  // https://bridged-service-demo.s3-us-west-1.amazonaws.com/games-tanks-demo/index.html
  "games-tanks-demo": {
    device: "embed_ipad_12_9_landscape",
  },
  "games-dragon-crushers": {
    device: "embed_ipad_12_9_landscape",
  },
  "games-endless-runner": {
    device: "embed_iphone_x",
  },
};

/**
 * e.g. "games-tanks-demo" -> "https://bridged-service-demo.s3-us-west-1.amazonaws.com/games-tanks-demo/index.html"
 * @param demo
 * @returns
 */
function buildDemoEmbedTargetUrl(demo: string): string {
  return `${DEFAULT_GAMES_DEMO_REGISTRY_BASE}${demo}/index.html`;
}

export default function GamesDemoPage() {
  const router = useRouter();
  const webglIframeRef = useRef(null);
  const demoName = router.query.name as string;
  const [demoUrl, setDemoUrl] = useState<string>(null);

  const sizeKey = "embed_iphone_x_landscape";
  const size = sizes[sizeKey];

  useEffect(() => {
    //
    // disable alert from iframe
    const iframe = webglIframeRef.current;
    if (iframe) {
      // inspect this. the game script is being loaded after, which makes this redundant.
      iframe.contentWindow.alert = function() {};
      console.log('disabled iframe function - "alert"');
    }
    //

    //
    // validate demo
    const demoSrcUrl = buildDemoEmbedTargetUrl(demoName);
    setDemoUrl(demoSrcUrl);
    //
  }, [webglIframeRef, router]);

  return (
    <DefaultScaffoldLayoyt title={demoName ?? "Games demo"}>
      <InnerEditorWorkspace
        canvas={
          <iframe
            ref={webglIframeRef}
            src={demoUrl}
            width={size.width}
            height={size.height}
          />
        }
        editor={<></>}
      ></InnerEditorWorkspace>
    </DefaultScaffoldLayoyt>
  );
}

const sizes: { [key: string]: { width: number; height: number } } = {
  embed_iphone_x: {
    width: 100,
    height: 100,
  },
  embed_iphone_x_landscape: {
    width: 1100,
    height: 550,
  },
  embed_ipad_12_9: {
    width: 100,
    height: 100,
  },
  embed_ipad_12_9_landscape: {
    width: 100,
    height: 100,
  },
  embed_macbook: {
    width: 100,
    height: 100,
  },
};
