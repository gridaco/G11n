import React from "react";
import Axios from "axios";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { setProjectData, RootState } from "core/store";

const client = Axios.create({
  baseURL: "http://localhost:3307",
});

export default function () {
  const dispatch = useDispatch();
  const [projects, setProjects] = React.useState<any[]>([]);

  React.useEffect(() => {
    client.get("/projects").then((res) => {
      setProjects(res.data);
    });
  }, []);

  return (
    <div
      style={{
        padding: 40,
      }}
    >
      <h1>My Projects</h1>
      <button>
        <Link href={`/projects/new`}>Create New Project</Link>
      </button>
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
              onClick={() => {
                dispatch(setProjectData({ id: project.id }));
              }}
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
    </div>
  );
}
