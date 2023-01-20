import { useRouter } from 'next/router';
import React from 'react';
import Axios from 'axios';

const client = Axios.create({
  baseURL: 'http://localhost:3307',
});
export default function () {
  const router = useRouter();
  const { id } = router.query;

  const saveProject = (project: {
    id: string;
    name: string;
    locales: string[];
  }) => {
    delete project.id;
    client.patch(`/projects/${id}/settings`, project);
  };

  const deleteProject = (id: string) => {
    client.delete(`/projects/${id}`).then(() => {
      router.push('/demo/v1/projects');
    });
  };

  return (
    <ProjectSettingView id={id} onSave={saveProject} onDelete={deleteProject} />
  );
}

function ProjectSettingView({
  id,
  onSave: saveProject,
  onDelete: deleteProject,
}: {
  id: string | string[];
  onSave: (project: any) => void;
  onDelete: (id: string) => void;
}) {
  const [project, setProject] = React.useState<any>({ name: '', locales: [] });

  React.useEffect(() => {
    client.get(`/projects/${id}`).then((res) => {
      setProject(res.data);
    });
  }, []);

  const locales = ['en', 'ko', 'ja'];

  return (
    <div
      style={{
        padding: 40,
      }}
    >
      <h1>{project.name} Settings</h1>
      Project Name:{' '}
      <input
        type="text"
        onChange={(e) => setProject({ ...project, name: e.target.value })}
        value={project.name || ''}
      />
      <br />
      Locales:
      {locales.map((locale: string, i: number) => {
        const isUsing = project.locales.includes(locale);
        return (
          <div key={i}>
            <input
              type="checkbox"
              name={locale}
              value={locale}
              onChange={(e) => {
                if (e.target.checked) {
                  setProject({
                    ...project,
                    locales: [...project.locales, locale],
                  });
                } else {
                  setProject({
                    ...project,
                    locales: project.locales.filter(
                      (l: string) => l !== locale
                    ),
                  });
                }
              }}
              checked={isUsing}
            />
            {locale}
          </div>
        );
      })}
      <button onClick={() => saveProject(project)}>save</button>
      <button
        style={{
          backgroundColor: 'red',
          color: 'lightyellow',
          marginLeft: 5,
        }}
        onClick={() => deleteProject(project.id)}
      >
        delete project
      </button>
    </div>
  );
}
