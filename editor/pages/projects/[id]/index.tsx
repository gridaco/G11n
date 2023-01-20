import { useRouter } from "next/router";
import React from "react";
import Axios from "axios";
import Link from "next/link";

const client = Axios.create({
  baseURL: "http://localhost:3307",
});

export default function () {
  const router = useRouter();
  const { id } = router.query;

  const [locales, setLocales] = React.useState<any[]>([]);
  const [locale, setLocale] = React.useState<string>("");
  const [keys, setKeys] = React.useState<any[]>([]);
  const [key, setKey] = React.useState<any>({ value: { [locale]: "" } });

  const onDeleteKey = (id: string) => {
    client.delete(`/texts/${id}`).then((res) => {
      keys.forEach((k, i) => {
        k.id === id ? keys.splice(i, 1) : null;
      });
      setKeys([...keys]);
      setKey({ value: { [locale]: "" } });
    });
  };

  const onCreateNewKey = (key: any) => {
    key.projectId = id;
    const data = key;
    client.post("/texts", data).then((res) => {
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

  return (
    <div
      style={{
        margin: 40,
      }}
    >
      <h1>Project {id}</h1>
      <div
        style={{
          display: "flex",
        }}
      >
        <div
          style={{
            flex: 1,
            padding: 20,
          }}
        >
          <SetLocaleView
            locale={locale}
            projectId={id}
            locales={locales}
            onChange={setLocale}
            setLocales={setLocales}
          />
          <KeyListView
            projectId={id}
            keys={keys}
            locale={locale || "null"}
            onGetKeys={setKeys}
            onClick={setKey}
            onDeleteKey={onDeleteKey}
          />
          <button>
            <Link href={`/projects/${id}/export`}>Download</Link>
          </button>
        </div>
        <div
          style={{
            flex: 1,
            padding: 20,
          }}
        >
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

function KeyListView({
  projectId: projectId,
  keys: keys,
  locale: locale,
  onGetKeys: setKeys,
  onClick: setKey,
  onDeleteKey,
}: {
  projectId: string | string[];
  keys: any[];
  locale: string;
  onGetKeys: (keys: any[]) => void;
  onClick: (key: any) => void;
  onDeleteKey: (id: string) => void;
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
              backgroundColor: "orange",
              display: "flex",
              justifyContent: "space-between",
            }}
            onClick={() => {
              setKey(key);
            }}
            className="aa"
            key={i}
          >
            key: {key.key}
            <br />
            value: {key.value ? key.value[locale] : ""}
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
  projectId: string | string[];
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
      LOCALE:{" "}
      <select value={locale} onChange={(e) => setLocale(e.target.value)}>
        <option key={-1}></option>
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
        Key:{" "}
        <input
          value={currentKey.key || ""}
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
            {locale}:{" "}
            <input
              value={currentKey?.value[locale] || ""}
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
        {currentKey.id ? "update" : "create"}
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
