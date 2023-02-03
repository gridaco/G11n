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
import SingleKeyEditor from "scaffolds/key-editor";

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
    if (router && router.query && router.query.id) {
      client.get(`/projects/${router.query.id}`).then((res) => {
        dispatch(setProjectData(res.data));
        client
          .get(
            `/texts/${router.query.id || null}/locales/${
              project?.selectedLocale || null
            }`
          )
          .then((res) => {
            setTranslations(
              res.data.map((x) => {
                const translations = {};
                for (let key in x.value) {
                  translations[key] = {
                    id: x.id,
                    type: "TEXT",
                    value: x.value[key],
                  };
                }
                return {
                  keyId: x.id,
                  projectId: x.projectId,
                  translation: {
                    id: x.id,
                    key: x.key,
                    translations: translations,
                  },
                };
              })
            );

            dispatch(
              setProjectData({
                textSets: res.data,
                targetLayer: { value: res.data[0].value["en"] },
              })
            );
          });
      });
    }
  }, [router]);

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

  const onKeyChange = (locale: string, value: string) => {
    dispatch(
      setProjectData({
        selectedTextSet: {
          ...project.selectedTextSet,
          value: { ...project.selectedTextSet.value, [locale]: value },
        },
      })
    );
  };
  const onKeySubmit = () => {
    let data = { ...project.selectedTextSet };
    delete data.id;
    client.patch(`/texts/${project.selectedTextSet.id}`, data).then((res) => {
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

  console.log(project);
  const SampleCanvas = () => {
    return (
      <div
        onClick={(e) => {
          console.log(e);
          dispatch(setProjectData({ targetLayer: { value: e.target } }));
        }}
      >
        {project?.targetLayer?.value}
      </div>
    );
  };
  const editorSwitch = (): boolean => {
    return project?.targetLayer !== null;
  };

  const EditorBody = () => {
    return editorSwitch() ? (
      <SingleKeyEditor key={project.targetLayer?.value} />
    ) : (
      <SceneKeyEditor />
    );
  };

  return (
    <InnerEditorWorkspace
      canvas={<SampleCanvas />}
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
