import { createElement } from 'react';
import React from 'react';
import Axios from 'axios';

const client = Axios.create({
  baseURL: 'http://localhost:3307',
});

export default function() {
  const [projects, setProjects] = React.useState<any[]>([]);

  const [projectId, setProjectId] = React.useState<string>('');

  const [locales, setLocales] = React.useState<any[]>([]);

  const [locale, setLocale] = React.useState<string>('');

  const [keys, setKeys] = React.useState<any[]>([]);

  const [key, setKey] = React.useState<any>({ value: { [locale]: '' } });

  const onProjectCreate = (project: any) => {
    client.post('/projects', project).then((res) => {
      setProjects([...projects, res.data]);
    });
  };

  const onProjectChange = (projectId: string) => {
    setProjectId(projectId);
    setKey({ value: { [locale]: '' } });
  };

  const onCreateNewKey = (key: any) => {
    key.projectId = projectId;
    const data = key;
    client.post('/texts', data).then((res) => {
      setKeys([...keys, res.data]);
      setKey(res.data);
    });
    // alert("key created: " + key);
  };

  const onUpdateKey = (key: any) => {
    let data = { ...key };
    delete data.id;
    client.patch(`/texts/${key.id}`, data).then((res) => {
      keys.forEach((k, i) => {
        k.id === res.data.id ? (keys[i] = res.data) : null;
      });
      setKeys([...keys]);
    });
    // alert("key created: " + key);
  };

  const onDeleteKey = (id: string) => {
    client.delete(`/texts/${id}`).then((res) => {
      keys.forEach((k, i) => {
        k.id === id ? keys.splice(i, 1) : null;
      });
      setKeys([...keys]);
      setKey({ value: { [locale]: '' } });
    });
    // alert("key created: " + key);
  };

  const exportProject = (projectId: string) => {
    client
      .get(`/projects/${projectId}/export`, {
        responseType: 'blob',
      })
      .then((res) => {
        const href = URL.createObjectURL(res.data);
        const link = document.createElement('a');
        link.href = href;
        link.setAttribute('download', 'attachments.zip');
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(href);
      });
  };
  return (
    <div
      style={{
        padding: 40,
      }}
    >
      <h1>V1 Playground {projectId}</h1>

      <CreateProject onClick={onProjectCreate}></CreateProject>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <div
          style={{
            flex: 1,
            border: '1px solid black',
            padding: 20,
          }}
        >
          {/* select project */}
          <SelectProjectsView
            value={projectId}
            projects={projects}
            getProjects={setProjects}
            onChange={onProjectChange}
          />
          {/* select locale */}
          <SetLocaleView
            locale={locale}
            projectId={projectId}
            locales={locales}
            onChange={setLocale}
            setLocales={setLocales}
          />

          {/* get key list by project */}
          {projectId ? (
            <GetKeysByProject
              projectId={projectId}
              keys={keys}
              locale={locale || 'null'}
              onGetKeys={setKeys}
              onClick={setKey}
              onDeleteKey={onDeleteKey}
              exportProject={exportProject}
            />
          ) : null}
        </div>
        <div
          style={{
            flex: 1,
            border: '1px solid black',
            padding: 20,
          }}
        >
          {/* create key */}
          <CreateKeyView
            locales={locales}
            currentKey={key}
            onCreate={onCreateNewKey}
            onUpdate={onUpdateKey}
            onClickedNewKey={setKey}
          />
        </div>
      </div>
    </div>
  );
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
    </>
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
      <h2>Term List</h2>
      PROJECT:{' '}
      <select
        value={projectId}
        onChange={(e) => {
          onProjectChange(e.target.value);
        }}
      >
        <option key="0"></option>
        {projects.map((project, i) => {
          return (
            <option key={i} value={project.id}>
              {project.name}
            </option>
          );
        })}
      </select>
    </>
  );
}

function SetLocaleView({
  locale: locale,
  projectId: projectId,
  locales: locales,
  onChange: setLocale,
  setLocales: setLocales,
}: {
  locale: string;
  projectId: string;
  locales: string[];
  onChange: (locale: string) => void;
  setLocales: (locales: string[]) => void;
}) {
  React.useEffect(() => {
    client.get(`/projects/${projectId}`).then((res) => {
      setLocales(res.data.locales || []);
    });
  }, [projectId]);

  return (
    <>
      LOCALE:{' '}
      <select value={locale} onChange={(e) => setLocale(e.target.value)}>
        <option key="0"></option>
        {locales.map((locale, i) => {
          return (
            <option key={i} value={locale}>
              {locale}
            </option>
          );
        })}
      </select>
    </>
  );
}

function GetKeysByProject({
  projectId: projectId,
  keys: keys,
  locale: locale,
  onGetKeys: setKeys,
  onClick: setKey,
  onDeleteKey,
  exportProject,
}: {
  projectId: string;
  keys: any[];
  locale: string;
  onGetKeys: (keys: any[]) => void;
  onClick: (key: any) => void;
  onDeleteKey: (id: string) => void;
  exportProject: (projectId: string) => void;
}) {
  React.useEffect(() => {
    // 로케일 필요한가
    client.get(`/texts/${projectId}/locales/${locale}`).then((res) => {
      setKeys(res.data || []);
    });
  }, [projectId]);

  return (
    <>
      {keys.map((key, i) => {
        return (
          <p
            style={{
              backgroundColor: 'orange',
              display: 'flex',
              justifyContent: 'space-between',
            }}
            onClick={() => {
              setKey(key);
            }}
            className="aa"
            key={i}
          >
            key: {key.key}
            <br />
            value: {key.value ? key.value[locale] : ''}
            <button
              onClick={() => {
                onDeleteKey(key.id);
              }}
            >
              delete
            </button>
          </p>
        );
      })}
      <button
        onClick={() => {
          exportProject(projectId);
        }}
      >
        export
      </button>
    </>
  );
}

function CreateKeyView({
  locales,
  currentKey,
  onCreate,
  onUpdate,
  onClickedNewKey,
}: {
  locales: string[];
  currentKey: any;
  onCreate: (key: any) => void;
  onUpdate: (key: any) => void;
  onClickedNewKey: (key: any) => void;
}) {
  // const [keyPreview, setKeyPreview] = React.useState<string>('');
  const [key, setKey] = React.useState<any>({});

  return (
    <>
      <h2>
        Key:{' '}
        <input
          value={currentKey.key || ''}
          placeholder="key"
          onChange={(e) => {
            // setKeyPreview(e.target.value);
            currentKey.key = e.target.value;
            setKey({ ...currentKey });
          }}
        />
      </h2>
      {/* <p>preview = {keyPreview.length == 0 ? 'empty' : keyPreview}</p> */}
      {locales.map((locale, i) => {
        return (
          <p key={i}>
            {locale}:{' '}
            <input
              value={currentKey?.value[locale] || ''}
              placeholder={locale}
              onChange={(e) => {
                currentKey.value[locale] = e.target.value;
                setKey({ ...currentKey });
              }}
            />
          </p>
        );
      })}
      <button
        onClick={() => {
          if (currentKey.id) {
            onUpdate(currentKey);
          } else {
            onCreate(currentKey);
          }
        }}
      >
        {currentKey.id ? 'update' : 'create'}
      </button>
      <button
        onClick={() => {
          onClickedNewKey({ value: {} });
        }}
      >
        New Key
      </button>
    </>
  );
}
