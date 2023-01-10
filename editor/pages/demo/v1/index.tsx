import React from 'react';
import Axios from 'axios';

const client = Axios.create({
  baseURL: 'http://localhost:3307',
});

export default function() {
  const [projectId, setProjectId] = React.useState<string>('');

  const [locales, setLocales] = React.useState<any[]>([]);

  const [locale, setLocale] = React.useState<string>('');

  const [keys, setKeys] = React.useState<any[]>([]);

  const [key, setKey] = React.useState<any>({ value: { [locale]: '' } });

  const onCreateNewKey = (key: any) => {
    key.projectId = projectId;
    const data = key;
    client.post('/texts', data).then((res) => {
      setKeys([...keys, res.data]);
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

  const onDeletedKey = (id: string) => {
    console.log(id);
    client.delete(`/texts/${id}`).then((res) => {
      keys.forEach((k, i) => {
        k.id === id ? keys.splice(i, 1) : null;
      });
      setKeys([...keys]);
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
            locales={locales}
            onChange={setLocale}
            setLocales={setLocales}
          />

          {/* get key list by project */}
          {projectId ? (
            <GetKeysByProject
              projectId={projectId}
              locale={locale || 'null'}
              onClick={setKey}
              onDeletedKey={onDeletedKey}
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
            onCreated={onCreateNewKey}
            onUpdated={onUpdateKey}
            onClickedNewKey={setKey}
          />
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
  locale: locale,
  onClick: setKey,
  onDeletedKey,
}: {
  projectId: string;
  locale: string;
  onClick: (key: any) => void;
  onDeletedKey: (id: string) => void;
}) {
  const [keys, setKeys] = React.useState<any[]>([]);

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
            value: {key.value[locale]}
            <button
              onClick={() => {
                onDeletedKey(key.id);
              }}
            >
              delete
            </button>
          </p>
        );
      })}
    </>
  );
}

function CreateKeyView({
  locales,
  currentKey,
  onCreated,
  onUpdated,
  onClickedNewKey,
}: {
  locales: string[];
  currentKey: any;
  onCreated: (key: any) => void;
  onUpdated: (key: any) => void;
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
              value={currentKey.value[locale] || ''}
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
            onUpdated(currentKey);
          } else {
            onCreated(currentKey);
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
