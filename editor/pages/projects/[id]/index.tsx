import { useRouter } from "next/router";
import React from "react";
import Axios from "axios";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { setProjectData, RootState } from "core/store";

const client = Axios.create({
  baseURL: "http://localhost:3307",
});

export default function () {
  const router = useRouter();
  const { id } = router.query;
  const project = useSelector((state: RootState) => state.editor.data);
  const dispatch = useDispatch();

  console.log(project);
  const onDeleteKey = (id: string) => {
    client.delete(`/texts/${id}`).then((res) => {
      const keys = project.textSets.filter((k) => k.id !== id);

      dispatch(setProjectData({ textSets: keys, selectedTextSet: null }));
    });
  };

  const onCreateNewKey = (key: any) => {
    key.projectId = id;
    const data = key;
    client.post("/texts", data).then((res) => {
      dispatch(
        setProjectData({
          textSets: [...project.textSets, res.data],
          selectedTextSet: res.data,
        })
      );
    });
  };

  const onUpdateKey = (key: any) => {
    let data = { ...key };
    delete data.id;
    client.patch(`/texts/${key.id}`, data).then((res) => {
      const keys = project.textSets.map((k, i) => {
        if (k.id === res.data.id) {
          return res.data;
        } else {
          return k;
        }
      });
      dispatch(setProjectData({ textSets: keys }));
    });
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
          <SetLocaleView />
          <KeyListView onDeleteKey={onDeleteKey} />
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
          <CreateKeyView onCreate={onCreateNewKey} onUpdate={onUpdateKey} />
        </div>
      </div>
    </div>
  );
}

function KeyListView({ onDeleteKey }: { onDeleteKey: (id: string) => void }) {
  const project = useSelector((state: RootState) => state.editor.data);
  const dispatch = useDispatch();

  React.useEffect(() => {
    // 로케일 필요한가
    client
      .get(
        `/texts/${project?.projectId || null}/locales/${
          project?.selectedLocale || null
        }`
      )
      .then((res) => {
        dispatch(setProjectData({ textSets: res.data }));
      });
  }, [project?.selectedLocale]);

  return (
    <>
      {project?.textSets?.map((key, i) => {
        return (
          <p
            style={{
              backgroundColor: "orange",
              display: "flex",
              justifyContent: "space-between",
            }}
            onClick={() => {
              dispatch(setProjectData({ selectedTextSet: key }));
            }}
            className="aa"
            key={i}
          >
            key: {key.key}
            <br />
            value: {key.value ? key.value[project.selectedLocale || null] : ""}
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

function SetLocaleView() {
  const project = useSelector((state: RootState) => state.editor.data);
  const dispatch = useDispatch();

  React.useEffect(() => {
    client.get(`/projects/${project?.projectId || ""}`).then((res) => {
      dispatch(setProjectData({ locales: res.data.locales || [] }));
    });
  }, []);

  return (
    <>
      LOCALE:{" "}
      <select
        value={project?.selectedLocale || ""}
        onChange={(e) =>
          dispatch(setProjectData({ selectedLocale: e.target.value }))
        }
      >
        <option key={-1}></option>
        {project?.locales?.map((locale, i) => {
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
  onCreate,
  onUpdate,
}: {
  onCreate: (key: any) => void;
  onUpdate: (key: any) => void;
}) {
  const project = useSelector((state: RootState) => state.editor.data);
  const dispatch = useDispatch();
  const [createKeyInput, setCreateKeyInput] = React.useState({
    key: "",
    value: {},
  });
  return (
    <>
      <h2>
        Key:{" "}
        <input
          value={project?.selectedTextSet?.key || createKeyInput.key}
          placeholder="key"
          onChange={(e) => {
            if (project.selectedTextSet?.id) {
              dispatch(
                setProjectData({
                  selectedTextSet: {
                    ...project.selectedTextSet,
                    key: e.target.value,
                  },
                })
              );
            } else {
              setCreateKeyInput({ ...createKeyInput, key: e.target.value });
            }
          }}
        />
      </h2>
      {project?.locales?.map((locale, i) => {
        return (
          <p key={i}>
            {locale}:{" "}
            <input
              value={
                project?.selectedTextSet?.value[locale] ||
                createKeyInput.value[locale] ||
                ""
              }
              placeholder={locale}
              onChange={(e) => {
                if (project.selectedTextSet?.id) {
                  let selectedTextSet = {
                    ...project.selectedTextSet,
                    value: {
                      ...project.selectedTextSet?.value,
                      [locale]: e.target.value,
                    },
                  };

                  dispatch(
                    setProjectData({
                      selectedTextSet,
                    })
                  );
                } else {
                  setCreateKeyInput({
                    ...createKeyInput,
                    value: {
                      ...createKeyInput.value,
                      [locale]: e.target.value,
                    },
                  });
                }
              }}
            />
          </p>
        );
      })}
      <button
        onClick={() => {
          if (project.selectedTextSet?.id) {
            onUpdate(project.selectedTextSet);
          } else {
            onCreate(createKeyInput);
          }
        }}
      >
        {project?.selectedTextSet?.id ? "update" : "create"}
      </button>
      <button
        onClick={() => {
          if (project.selectedTextSet?.id) {
            dispatch(setProjectData({ selectedTextSet: null }));
          } else {
            setCreateKeyInput({ key: "", value: {} });
          }
        }}
      >
        New Key
      </button>
    </>
  );
}
