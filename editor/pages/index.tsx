import { createElement } from "react";
import React from "react";
import Axios from "axios";

const client = Axios.create({
  baseURL: "http://localhost:3307",
});

export default function () {
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
      <h1>Home</h1>
      {projects.map((project, i) => {
        return (
          <p
            style={{
              backgroundColor: "lightgray",
            }}
            key={project.id}
          >
            {project.name}
          </p>
        );
      })}
    </div>
  );
}
