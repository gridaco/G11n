import React from 'react';
import Axios from 'axios';

const client = Axios.create({
  baseURL: 'http://localhost:3307',
});

export default function () {
  const onProjectCreate = (project: any) => {
    client.post('/projects', project);
  };

  return <CreateProject onClick={onProjectCreate} />;
}

function CreateProject({
  onClick: onCreateProject,
}: {
  onClick: (project: any) => void;
}) {
  const locales = ['en', 'ko', 'ja'];

  const [project, setProject] = React.useState<any>({ name: '', locales: [] });
  return (
    <>
      <div
        style={{
          padding: 40,
        }}
      >
        <h2>Create Project</h2>
        Project Name:{' '}
        <input
          type="text"
          onChange={(e) => {
            setProject({ ...project, name: e.target.value });
          }}
        />
        <br />
        Select Locales <br />
        {locales.map((locale, i) => {
          return (
            <label key={i}>
              - {locale}:{' '}
              <input
                type="checkbox"
                name={locale}
                value={locale}
                onChange={(e) => {
                  if (
                    e.target.checked &&
                    !project.locales.some((l: string) => l === e.target.name)
                  ) {
                    const locales = [...project.locales, e.target.value];
                    setProject({ ...project, locales });
                  }
                }}
              />
              <br />
            </label>
          );
        })}
        <button onClick={() => onCreateProject(project)}>create</button>
      </div>
    </>
  );
}
