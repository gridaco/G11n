import React, { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import {
  IconButton,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useRouter } from "next/router";
import { DefaultScaffoldLayoyt } from "layouts/default-layout";
import { InnerEditorWorkspace } from "scaffolds/editor/inner-editor-workspace";
import { RealtimeEditEditorClient } from "services/realtime-edit";
import { Header } from "scaffolds/key-editor";
import { PlayIcon, PauseIcon } from "@radix-ui/react-icons";
import { TranslationSetForKey } from "components/g11n/translation-set-for-key";

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

  const gameConfig = DEFAULT_GAMES_DEMO_REGISTRY[demoName];
  const size = sizes[gameConfig?.device ?? "embed_iphone_x_landscape"];

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
        editor={demoName && <RealtimeEditor appId={demoName} />}
      ></InnerEditorWorkspace>
    </DefaultScaffoldLayoyt>
  );
}

function RealtimeEditor(props: { appId: string }) {
  const client = new RealtimeEditEditorClient(props.appId);
  const [
    currentSelectedLayerTextValue,
    setCurrentSelectedLayerTextValue,
  ] = useState<string>();

  const [paused, setPaused] = useState<boolean>(false);

  useEffect(() => {
    client.addOnLayerSelectListener((data: { text: string; layer: string }) => {
      console.log("onLayerSelect", data);
      setCurrentSelectedLayerTextValue(data.text);
    });
  }, []);

  //setup realtime client
  return (
    <>
      <>
        <Header title="Rename Key" />
        <EditorContent>
          <div style={{ marginBottom: 24 }}>
            <IconButton
              onClick={() => {
                if (paused) {
                  client.resumeApp();
                  setPaused(false);
                } else {
                  client.pauseApp();
                  setPaused(true);
                }
              }}
            >
              {paused ? <PlayIcon /> : <PauseIcon />}
            </IconButton>
          </div>
          <FieldWrapper>
            <InputField>Key Name</InputField>
            {/* <TextInput value={props.gkey.key} disabled /> */}
          </FieldWrapper>
          <FieldWrapper>
            <InputField>Value</InputField>

            <TranslationSetForKey
              key={"main"}
              locales={["en", "ko", "ja"]}
              onSubmit={() => {}}
              onEdit={(locale, value) => {
                client.updateLayer("", { text: value, locale: "" });
              }}
              // translations={{ en: "currentSelectedLayerTextValue", "": "" }}
            />
            {/* {translations !== undefined ? (
            ) : (
              <ProgressContainer>
                <CircularProgress />
              </ProgressContainer>
            )} */}
          </FieldWrapper>
        </EditorContent>
      </>
    </>
  );
}

const EditorContent = styled.div`
  padding: 24px 32px;
`;

const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 32px;
`;

const InputField = styled.h2`
  margin: 0;
  font-weight: normal;
  font-size: 14px;
  line-height: 1.2;
  color: #888888;
  margin-bottom: 16px;
`;

const sizes: { [key: string]: { width: number; height: number } } = {
  embed_iphone_x: {
    width: 375,
    height: 812,
  },
  embed_iphone_x_landscape: {
    width: 812,
    height: 375,
  },
  embed_ipad_12_9: {
    width: 1024,
    height: 1366,
  },
  embed_ipad_12_9_landscape: {
    width: 1366,
    height: 1024,
  },
  embed_macbook: {
    width: 1600,
    height: 2400,
  },
} as const;
