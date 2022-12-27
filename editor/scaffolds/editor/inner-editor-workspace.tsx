import React from "react";
import { useRecoilState } from "recoil";
import { Resizable } from "re-resizable";
import styled from "@emotion/styled";
import { editorState } from "../../states/text-editor.state";
import CanvasPreview from "../preview";

export function InnerEditorWorkspace(props: {
  canvas: JSX.Element;
  editor: JSX.Element;
}) {
  const [, setIsSelect] = useRecoilState(editorState);

  return (
    <Wrapper>
      <CanvasPreview
        onBackgroundClick={(e) => {
          console.log(e);
          setIsSelect(false);
        }}
      >
        {props.canvas}
      </CanvasPreview>
      <Resizable
        style={{
          paddingBottom: 0,
          backgroundColor: "#fff",
          display: "flex",
          flexDirection: "column",
        }}
        defaultSize={{
          width: "50%",
          height: "calc(100vh - 56px)",
        }}
        maxWidth="50%"
        minWidth="20%"
        maxHeight="calc(100vh - 56px)"
      >
        {props.editor}
      </Resizable>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  overflow: hidden;
  justify-content: space-between;
  margin-top: 56px;
`;
