import React from "react";
import Axios from "axios";
import { useRouter } from "next/router";
import { Button, TextFormField } from "@editor-ui/console";
import styled from "@emotion/styled";
import { useSelector, useDispatch } from "react-redux";
import { RootState, setNewProjectData } from "core/store";

const Page = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100vh;
  margin: auto;
  max-width: 850px;
`;

const FormPart = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
  width: 340px;
  height: 650px;
`;

const RenderPart = styled.div`
  height: 650px;
  width: 400px;
  box-shadow: 0px 4px 32px 8px rgba(0, 0, 0, 0.04);
  border-radius: 4px;
  padding: 20px;
`;

const Url = styled.div`
  color: rgba(0, 0, 0, 0.6);
  font-size: 11px;
  margin-bottom: 10px;
`;

const RenderedUrl = styled.div`
  padding: 10px 14px;
  min-width: 106px;
  min-height: 132px;
  border: 1px solid #000000;
  border-radius: 2px;
  margin: 5px;
`;

const Comment = styled.p`
  color: rgba(0, 0, 0, 0.6);
  font-size: 11px;
  font-family: Inter;
  font-style: normal;
  font-weight: 400;
  margin: 10px 0 10px 0;
`;

export default function setStartPages() {
  const newProject = useSelector((state: RootState) => state.newProject.data);
  const dispatch = useDispatch();
  const router = useRouter();
  const [url, setUrl] = React.useState<string>("");

  const addUrl = (url: string) => {
    if (!url || newProject?.urls.some((u) => u === url || u === "/" + url))
      return;
    if (url[0] !== "/") url = "/" + url;
    dispatch(setNewProjectData({ urls: [...newProject?.urls, url] }));
    setUrl("");
  };

  const onSaveClick = async () => {};

  const deleteUrl = (e: any) => {
    const url = e.target.id;
    dispatch(
      setNewProjectData({ urls: newProject?.urls.filter((u) => u !== url) })
    );
  };

  return (
    <Page>
      <FormPart>
        <h3>grida.co</h3>
        <div>
          <h2>Pages to get started with</h2>
          <Comment>💡 Pro tip: start small, expand later. </Comment>
          <div style={{ height: 30 }}></div>
          <TextFormField
            label="Search URL"
            placeholder="/about"
            onEnter={addUrl}
            onChange={setUrl}
            value={url || ""}
          />
          <div style={{ height: 20 }}></div>
          {newProject?.urls?.map((url, i) => {
            return (
              <Url id={url} key={i} onClick={(e) => deleteUrl(e)}>
                {url}
              </Url>
            );
          })}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button width="165px" onClick={onSaveClick}>
            Save & Continue
          </Button>
          <Comment>2 of 3</Comment>
        </div>
      </FormPart>
      <RenderPart>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            flexWrap: "wrap",
          }}
        >
          {newProject?.urls.map((url, i) => {
            return <RenderedUrl key={i}>{url}</RenderedUrl>;
          })}
        </div>
      </RenderPart>
    </Page>
  );
}
