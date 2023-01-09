import React from 'react';
import Axios from 'axios';

const client = Axios.create({
  baseURL: 'http://localhost:3307',
});

export default function() {
  const [projectId, setProjectId] = React.useState<string>('');

  const [locale, setLocale] = React.useState<string>('');

  const [keys, setKeys] = React.useState<any[]>([]);

  // const [key, setKey] = React.useState<object>({});

  const onCreateNewKey = (key: string, value: string) => {
    const data = {
      key,
      projectId: projectId,
      // value: JSON.stringify({ [locale]: value }),
      value: { [locale]: value },
    };
    client.post('/texts', data).then((res) => {
      setKeys([...keys, res.data]);
    });
    // alert("key created: " + key);
  };

  return (
    <div
      style={{
        padding: 40,
      }}
    >
      <h1>V1 Playground {projectId}</h1>
      {/* select project */}
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
          <SelectProjectsView value={projectId} onChange={setProjectId} />
          {/* select locale */}
          <SetLocaleView
            locale={locale}
            projectId={projectId}
            onChange={setLocale}
          />

          {/* get key list by project */}
          {projectId ? (
            <GetKeysByProject projectId={projectId} locale={locale || 'null'} />
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
          <CreateKeyView onSubmit={onCreateNewKey} />
        </div>
      </div>
    </div>
  );
}

function SelectProjectsView({
  value: projectId,
  onChange: setProjectId,
}: {
  value: string;
  onChange: (projectId: string) => void;
}) {
  const [projects, setProjects] = React.useState<any[]>([]);

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
          setProjectId(e.target.value);
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
  onChange: setLocale,
}: {
  locale: string;
  projectId: string;
  onChange: (locale: string) => void;
}) {
  const [locales, setLocales] = React.useState<any[]>([]);

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
  locale: locale,
}: {
  projectId: string;
  locale: string;
}) {
  const [keys, setKeys] = React.useState<any[]>([]);
  console.log(locale);
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
            }}
            onClick={() => {}}
            className="aa"
            key={i}
          >
            key: {key.key}
            <br />
            value: {key.value[locale]}
          </p>
        );
      })}
    </>
  );
}

function CreateKeyView({
  onSubmit,
}: {
  onSubmit: (key: string, value: string) => void;
}) {
  const [key, setKey] = React.useState<string>('');
  const [value, setValue] = React.useState<string>('');

  return (
    <>
      <h2>
        Key:{' '}
        <input
          placeholder="key"
          onChange={(e) => {
            setKey(e.target.value);
          }}
        />
      </h2>
      <p>preview = {key.length == 0 ? 'empty' : key}</p>
      value :{' '}
      <input
        placeholder="value"
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />
      <button
        onClick={() => {
          onSubmit(key, value);
        }}
      >
        create
      </button>
    </>
  );
}
