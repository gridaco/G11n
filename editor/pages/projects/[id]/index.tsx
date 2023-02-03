import { useRouter } from "next/router";
import React, { useState, useMemo } from "react";
import { assets } from "@base-sdk/base";
import styled from "@emotion/styled";
import Axios from "axios";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { setProjectData, RootState } from "core/store";
import { Button, TextFormField } from "@editor-ui/console";
import SceneKeyEditor from "scaffolds/scene-key-editor";
import { InnerEditorWorkspace } from "scaffolds/editor/inner-editor-workspace";
import CanvasStage from "components/canvas/stage";

export interface RawAsset {}

export declare type Translations = Map<string, RawAsset>;

const client = Axios.create({
  baseURL: "http://localhost:3307",
});

export default function () {
  const router = useRouter();
  const project = useSelector((state: RootState) => state.editor.data);
  const [translations, setTranslations] = React.useState<ReadonlyArray<any>>(
    []
  );
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (router && router.query) {
      dispatch(setProjectData({ projectId: router.query.id }));
    }
  }, [router]);

  React.useEffect(() => {
    if (project?.projectId) {
      client
        .get(
          `/texts/${project?.projectId || null}/locales/${
            project?.selectedLocale || null
          }`
        )
        .then((res) => {
          setTranslations(
            res.data.map((x) => {
              const translations = {};
              for (let key in x.value) {
                translations[key] = {
                  id: x.key.id,
                  type: "TEXT",
                  value: x.value[key],
                };
              }
              return {
                keyId: x.id,
                projectId: x.id,
                translation: {
                  key: x.key,
                  translations: translations,
                },
              };
            })
          );

          dispatch(setProjectData({ textSets: res.data }));
        });
    }
  }, [project?.projectId]);
  const deleteKey = (id: string) => {
    client.delete(`/texts/${id}`).then((res) => {
      const keys = project.textSets.filter((k) => k.id !== id);

      dispatch(setProjectData({ textSets: keys, selectedTextSet: null }));
    });
  };

  const createNewKey = (key: any) => {
    if (!key.key) {
      alert("key is empty");
      return;
    }
    key.projectId = project.projectId;
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

  const updateKey = (key: any) => {
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

  const onKeyChange = () => {};
  const onKeySubmit = () => {};

  return (
    <InnerEditorWorkspace
      canvas={<CanvasStage />}
      editor={
        <SceneKeyEditor
          onKeyChange={onKeyChange}
          onKeySubmit={onKeySubmit}
          _translations={translations}
        />
      }
    ></InnerEditorWorkspace>
  );
}

// function KeyListView({ deleteKey }: { deleteKey: (id: string) => void }) {
//   const project = useSelector((state: RootState) => state.editor.data);
//   const [translations, setTranslations] = React.useState<ReadonlyArray<any>>(
//     []
//   );

//   const [isOpen, setIsOpen] = useState(false);

//   const dispatch = useDispatch();

//   React.useEffect(() => {
//     if (!project?.projectId) return;
//     // 로케일 필요한가
//   }, [project?.projectId]);

//   const onKeyChange = (locale: string, value: string) => {
//     console.log(value);
//   };

//   const onKeySubmit = (locale: string, value: string) => {
//     console.log(value);
//   };

//   return <></>;
// }

function SetLocaleView() {
  const project = useSelector((state: RootState) => state.editor.data);
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (!project?.projectId) return;
    client.get(`/projects/${project?.projectId || ""}`).then((res) => {
      dispatch(setProjectData({ locales: res.data.locales || [] }));
    });
  }, [project?.projectId]);

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
          <div key={i}>
            <TextFormField
              label={locale}
              value={
                project?.selectedTextSet?.value[locale] ||
                createKeyInput.value[locale] ||
                ""
              }
              placeholder={locale}
              onChange={(value) => {
                if (project.selectedTextSet?.id) {
                  let selectedTextSet = {
                    ...project.selectedTextSet,
                    value: {
                      ...project.selectedTextSet?.value,
                      [locale]: value,
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
                      [locale]: value,
                    },
                  });
                }
              }}
            />
            {/* {locale}:{" "}
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
            /> */}
          </div>
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
