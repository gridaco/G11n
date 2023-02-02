import React from "react";
import Axios from "axios";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { setProjectData, RootState } from "core/store";
import { Button, TextField } from "@editor-ui/console";
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

export default function () {
  const dispatch = useDispatch();
  const [projects, setProjects] = React.useState<any[]>([]);

  React.useEffect(() => {
    client.get("/projects").then((res) => {
      setProjects(res.data);
    });
  }, []);

  return (
    <Page>
      <h1>My Projects</h1>

      {projects.map((project, i) => {
        return (
          <div
            key={i}
            style={{
              backgroundColor: "orange",
              margin: "10px 0 10px 0",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Link
              href={`/projects/${project.id}`}
              // onClick={() => {
              //   dispatch(setProjectData({ projectId: project.id }));
              // }}
            >
              {project.name}
              <br />
            </Link>
            <div>
              <button>
                <Link href={`/projects/${project.id}/settings`}>Setting</Link>
              </button>
              <button>
                <Link href={`/projects/${project.id}/export`}>Download</Link>
              </button>
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
