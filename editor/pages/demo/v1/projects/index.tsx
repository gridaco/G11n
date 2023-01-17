import React from 'react';
import Axios from 'axios';
import Link from 'next/link';

const client = Axios.create({
  baseURL: 'http://localhost:3307',
});

export default function () {
  const [projects, setProjects] = React.useState<any[]>([]);
  const [projectId, setProjectId] = React.useState<string>('');

  const onProjectChange = (projectId: string) => {
    setProjectId(projectId);
  };

  return (
    <SelectProjectsView
      value={projectId}
      projects={projects}
      getProjects={setProjects}
      onChange={onProjectChange}
    />
  );
}

function SelectProjectsView({
  value: projectId,
  projects,
  getProjects: setProjects,
  onChange: onProjectChange,
}: {
  value: string;
  projects: any[];
  getProjects: (projects: any[]) => void;
  onChange: (projectId: string) => void;
}) {
  React.useEffect(() => {
    client.get('/projects').then((res) => {
      setProjects(res.data);
    });
  }, []);

  return (
    <>
      <div
        style={{
          padding: 40,
        }}
      >
        <h1>My Projects</h1>
        {projects.map((project, i) => {
          return (
            <div
              style={{
                backgroundColor: 'orange',
                margin: '10px 0 10px 0',
              }}
            >
              <Link href={`demo/v1/projects/${project.id}`}>
                {project.name}
                <br />
              </Link>
            </div>
          );
        })}
      </div>
    </>
  );
}
