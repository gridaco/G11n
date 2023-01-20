import React from 'react';
import Axios from 'axios';
import Link from 'next/link';

const client = Axios.create({
  baseURL: 'http://localhost:3307',
});

export default function () {
  const [projects, setProjects] = React.useState<any[]>([]);
  const [projectId, setProjectId] = React.useState<string>('');

  return <SelectProjectsView projects={projects} getProjects={setProjects} />;
}

function SelectProjectsView({
  projects,
  getProjects: setProjects,
}: {
  projects: any[];
  getProjects: (projects: any[]) => void;
}) {
  React.useEffect(() => {
    client.get('/projects').then((res) => {
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
        <Link href={`/demo/v1/projects/new`}>Create New Project</Link>
      </button>
      {projects.map((project, i) => {
        return (
          <div
            key={i}
            style={{
              backgroundColor: 'orange',
              margin: '10px 0 10px 0',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Link href={`/demo/v1/projects/${project.id}`}>
              {project.name}
              <br />
            </Link>
            <div>
              <button>
                <Link href={`/demo/v1/projects/${project.id}/settings`}>
                  Setting
                </Link>
              </button>
              <button>
                <Link href={`/demo/v1/projects/${project.id}/export`}>
                  Download
                </Link>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
