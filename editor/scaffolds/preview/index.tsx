import React, { useState } from "react";
import { usePinch } from "react-use-gesture";
import styled from "@emotion/styled";
import Background from "components/canvas/background";

export default function CanvasPreview(props: {
  onBackgroundClick: (e: any) => void;
  children: JSX.Element;
}) {
  // 1. TODO
  // implement zooming feature (reference: zeplin)

  const [zoom, setZoom] = useState<number>(1.0);

  const bind = usePinch((state) => {
    // console.log(state)
    // setZoom(zoom + 0.01)
  });

  return (
    <PreviewWrapper {...bind()}>
      <Background
        onClick={props.onBackgroundClick}
        style={{ overflow: "scroll", paddingTop: 54, paddingBottom: 54 }}
      >
        {/* <motion.div animate={{ zoom: zoom }}> */}
        <div
          style={{
            margin: "auto",
          }}
        >
          {props.children}
        </div>
        {/* </motion.div> */}
      </Background>
    </PreviewWrapper>
  );
}

const PreviewWrapper = styled.div`
  flex: 1;
  display: flex;
  height: calc(100vh - 56px);
`;
