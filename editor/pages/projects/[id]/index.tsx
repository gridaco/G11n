import { useRouter } from "next/router";
import React, { useState, useMemo } from "react";
import Axios from "axios";
import Link from "next/link";
import styled from "@emotion/styled";
import { useSelector, useDispatch } from "react-redux";

import { assets } from "@base-sdk/base";
import { setProjectData, RootState } from "core/store";
import { Button, TextFormField } from "@editor-ui/console";
import SceneKeyEditor from "scaffolds/scene-key-editor";
import { InnerEditorWorkspace } from "scaffolds/editor/inner-editor-workspace";
import CanvasStage from "components/canvas/stage";
import SingleKeyEditor from "scaffolds/key-editor";
import Header from "scaffolds/key-editor/header";
import TextInput from "components/g11n/text-input";
import { TranslationSetForKey } from "components/g11n/translation-set-for-key";

export interface RawAsset {}

export declare type Translations = Map<string, RawAsset>;

const client = Axios.create({
  baseURL: "http://localhost:3307",
});

const PAGE_TYPE = {
  SCENE: "scene",
  SINGLE: "single",
};

export default function () {
  const router = useRouter();
  const project = useSelector((state: RootState) => state.editor.data);
  const [translations, setTranslations] = React.useState<ReadonlyArray<any>>(
    []
  );
  const [pageType, setPageType] = React.useState<string>(PAGE_TYPE.SCENE);
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (router && router.query?.id) {
      client.get(`/projects/${router.query.id}`).then((res) => {
        dispatch(setProjectData({ ...res.data, projectId: res.data.id }));
      });
      client
        .get(
          `/texts/${router.query.id || null}/locales/${
            project?.selectedLocale || null
          }`
        )
        // set translations for prop in <editable-text-card />
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
            })
          );
        });
    }
  }, [router, pageType]);

  const onKeyChange = (locale: string, value: string) => {};
  const onKeySubmit = (keyId: string, locale: string, value: string) => {
    let data = project.textSets.find((x) => x.id === keyId);

    client
      .patch(`/texts/${keyId}`, {
        key: data.key,
        value: {
          ...data.value,
          [locale]: value,
        },
      })
      .then((res) => {
        const keys = [];
        project.textSets.forEach((k, i) => {
          if (k.id === res.data.id) {
            keys.push(res.data);
          } else {
            keys.push(k);
          }
        });
        dispatch(setProjectData({ textSets: keys }));
        setPageType("");
      });
  };
  const onKeyClick = (key: any) => {
    dispatch(setProjectData({ selectedTextSet: key }));
  };

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
    return pageType === PAGE_TYPE.SINGLE;
  };
  const EditorBody = () => {
    return editorSwitch() ? (
      <_SingleKeyEditor
        setPageType={setPageType}
        key={project?.targetLayer?.value}
      />
    ) : (
      <SceneKeyEditor
        onKeyChange={onKeyChange}
        onKeySubmit={onKeySubmit}
        _translations={translations}
        onClickAddKey={() => {
          setPageType(PAGE_TYPE.SINGLE);
        }}
      />
    );
  };

  return (
    <InnerEditorWorkspace
      canvas={<SampleCanvas />}
      editor={<EditorBody />}
    ></InnerEditorWorkspace>
  );
}

function _SingleKeyEditor({
  setPageType,
}: {
  setPageType: (pageType: string) => void;
}) {
  type SingleKeyEditorMode = "create-new" | "edit-existing" | "loading";
  const [mode, setMode] = useState<SingleKeyEditorMode>("loading");
  const project = useSelector((state: RootState) => state.editor.data);
  const dispatch = useDispatch();

  const goBack = () => {
    setPageType(PAGE_TYPE.SCENE);
  };

  if (!project?.targetLayer) {
    return <CreatNewKey goBack={goBack} layer={project?.targetLayer} />;
  }
}

function CreatNewKey({ goBack, layer: any }) {
  const project = useSelector((state: RootState) => state.editor.data);
  const dispatch = useDispatch();
  const [state, setState] = useState<string>("loaded");
  const [keyname, setkeyname] = useState<string>("");
  const [keyValue, setkeyValue] = useState<any>();
  const initialTranslations = new Map<string, assets.NestedAssetPutRequest>();

  const onKeyEdit = (locale: string, value: string) => {
    setkeyValue({ ...keyValue, [locale]: value });
  };

  const onKeySubmit = () => {
    if (!keyname) return;

    let data = {
      projectId: project.projectId,
      key: keyname,
      value: keyValue,
    };
    client.post("/texts", data).then((res) => {
      goBack();
    });
  };

  const handleKeyNameEdit = (e: any) => {
    const v = e.target.value;
    setkeyname(v);
  };

  return (
    <>
      <Header title="Add Key" onClickBack={goBack}>
        <Button onClick={onKeySubmit}>
          <span>+ Add Key</span>
        </Button>
      </Header>
      <EditorContent>
        {/*
          no key is set for selected layer "{textValue}"
          STATE: {state}
        */}
        <FieldWrapper>
          <InputField>Key Name</InputField>
          <TextInput onChange={handleKeyNameEdit} />
        </FieldWrapper>
        <FieldWrapper>
          <InputField>Value</InputField>
          <TranslationSetForKey
            key={keyname}
            locales={project?.locales}
            onEdit={onKeyEdit}
            onSubmit={onKeySubmit}
          />
        </FieldWrapper>
      </EditorContent>
    </>
  );
}

const EditorContent = styled.div`
  padding: 24px 32px;
`;

const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 32px;
`;

const InputField = styled.h2`
  margin: 0;
  font-weight: normal;
  font-size: 14px;
  line-height: 1.2;
  color: #888888;
  margin-bottom: 16px;
`;
