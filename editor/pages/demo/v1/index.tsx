import { createElement } from 'react';
import React from 'react';
import Axios from 'axios';
import Link from 'next/link';

const client = Axios.create({
  baseURL: 'http://localhost:3307',
});

export default function () {
  const [projects, setProjects] = React.useState<any[]>([]);

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
        link.setAttribute('download', 'translations.zip');
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

      <Link href="/demo/v1/projects/new">New Project</Link>
      <Link href="/demo/v1/projects">Project List</Link>
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
