import React from "react";
import Axios from "axios";
import { useRouter } from "next/router";
import { Button, TextFormField } from "@editor-ui/console";
import styled from "@emotion/styled";

const client = Axios.create({
  baseURL: "http://localhost:3307",
});

const Page = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  max-width: 340px;
  margin: auto;
`;

const BorderButton = styled.button`
  flex: 1;
  background-color: #fff;
  border: 1px solid;
  border-color: black;
  color: black;
  border-radius: 2px;
  min-height: 35px;
  cursor: pointer;
`;

const Comment = styled.p`
  color: rgba(0, 0, 0, 0.6);
  font-size: 11px;
  font-family: Inter;
  font-style: normal;
  font-weight: 400;
  margin: 10px 0 10px 0;
  width: 100%;
`;

export default function CreateProject() {
  const [name, setName] = React.useState<string>("");
  const [url, setUrl] = React.useState<string>("");
  const [projectType, setProjectType] = React.useState<string>("aw");

  const router = useRouter();
  const createProject = () => {
    if (!name) {
      window.alert("Please enter a project name");
      return;
    }
    const project = { name: name };
    client.post("/projects", project).then((res) => {
      router.push(`/projects/new/2/${res.data.id}`);
    });
  };

  const onProjectTypeChange = (e: any) => {
    setProjectType(e.target.name);
  };

  // TODO: ??
  const browseTemplate = () => {
    window.alert("Not implemented yet");
  };

  // TODO: route demo project page
  const openDemoProject = () => {
    window.alert("Not implemented yet");
  };

  function ToggleBorderButton({
    name,
    children,
  }: {
    name: string;
    children: string;
  }) {
    return (
      <BorderButton
        onClick={onProjectTypeChange}
        name={name}
        style={{
          maxWidth: 110,
          color: projectType === `${name}` ? "black" : "lightgray",
          borderColor: projectType === `${name}` ? "black" : "lightgray",
        }}
      >
        {children}
      </BorderButton>
    );
  }

  return (
    <Page>
      <button onClick={() => router.push(`/projects`)}>back</button>
      <h2>New Project</h2>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          margin: "30px 0 30px 0",
        }}
      >
        <ToggleBorderButton name="aw">App / Web</ToggleBorderButton>
        <ToggleBorderButton name="figma">Figma</ToggleBorderButton>
        <ToggleBorderButton name="game">Game</ToggleBorderButton>
      </div>
      <TextFormField
        placeholder="project name"
        label="Project name"
        onChange={setName}
      />
      <div style={{ height: 20 }}></div>
      <TextFormField
        placeholder="https://acme.com, http://localhost:3000"
        label="Website URL"
        onChange={setUrl}
      />
      <Comment>
        We will parse some resources from your site to get started
      </Comment>
      <div style={{ height: 20 }}></div>

      <Button onClick={createProject}>Next</Button>
      <div style={{ height: 30 }}></div>

      <Comment>💡 Not sure where to start?</Comment>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <BorderButton
          style={{ flex: 1, marginBottom: 5 }}
          onClick={browseTemplate}
        >
          Browse Templates
        </BorderButton>
        <BorderButton onClick={openDemoProject}>Open demo project</BorderButton>
      </div>
    </Page>
  );
}
