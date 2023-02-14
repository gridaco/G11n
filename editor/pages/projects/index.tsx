import React from "react";
import Axios from "axios";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { setProjectData, RootState } from "core/store";
import { Button, TextField } from "@editor-ui/console";
import styled from "@emotion/styled";
import { useRouter } from "next/router";
import { GearIcon, DownloadIcon } from "@radix-ui/react-icons";

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

export default function () {
  const dispatch = useDispatch();
  const router = useRouter();
  const [projects, setProjects] = React.useState<any[]>([]);

  React.useEffect(() => {
    client.get("/projects").then((res) => {
      setProjects(res.data);
    });
  }, []);

  const onMouseEnter = (e: any) => {
    e.target.style.background = "lightgray";
  };
  const onMouseLeave = (e: any) => {
    e.target.style.background = "";
  };

  return (
    <Page>
      <h1>My Projects</h1>

      {projects.map((project, i) => {
        return (
          <div
            key={i}
            style={{
              width: "100%",
              margin: "5px 0 5px 0",
              borderRadius: 10,
              border: "1px solid lightgray",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                flex: 1,
                padding: 20,
                cursor: "pointer",
              }}
              onClick={() => router.push(`/projects/${project.id}`)}
            >
              {project.name}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <GearIcon
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onClick={() => router.push(`/projects/${project.id}/settings`)}
                style={{
                  cursor: "pointer",
                  backgroundColor: "white",
                  borderRadius: 3,
                  width: 30,
                  height: 30,
                }}
              />

              <DownloadIcon
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onClick={() => router.push(`/projects/${project.id}/export`)}
                style={{
                  cursor: "pointer",
                  backgroundColor: "white",
                  borderRadius: 3,
                  width: 30,
                  height: 30,
                }}
              />
            </div>
          </div>
        );
      })}
      <Button>
        <Link href={`/projects/new`}>Create New Project</Link>
      </Button>
    </Page>
  );
}
