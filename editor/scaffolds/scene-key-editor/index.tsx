import React, { useEffect, useState, useMemo } from "react";
import { useRecoilState } from "recoil";
import styled from "@emotion/styled";
import { DesignGlobalizationRepository } from "@base-sdk/g11n";
import { LayerTranslation } from "@base-sdk/g11n";
import { useQueryParam, NumberParam, withDefault } from "use-query-params";

import Toolbar from "components/toolbar";
import {
  default as _EditableTextCard,
  EditableTextCardProps,
} from "components/g11n/editable-text-card";
import SearchInputBox from "components/search/search-input-box";
import { currentEditorialLocaleAtom } from "states/editor-state";
import { SceneRepositoryStore } from "repositories";
import Select from "./select";
import BottomBar from "./bottom-bar";
import PublishModal from "components/modals/publish-modal";
import { KeyboardIcon } from "@radix-ui/react-icons";
import { currentTextEditValueAtom } from "states";

interface ISceneKeyEditor {
  repository?: DesignGlobalizationRepository;
  _translations?: any;
  onKeyChange?: (locale: string, value: string) => void;
  onKeySubmit?: (locale: string, value: string) => void;
}

const SceneKeyEditor: React.FC<ISceneKeyEditor> = ({
  repository,
  _translations,
  onKeyChange,
  onKeySubmit,
}) => {
  const [query, setQuery] = useState<string>("");
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
  const [bottomBarChanges] = useQueryParam(
    "changes",
    withDefault(NumberParam, 0)
  );
  const isBottomBarOpen = !!bottomBarChanges;

  const [translations, setTranslations] = useState<
    ReadonlyArray<LayerTranslation>
  >([]);
  const [locale, setLocale] = useRecoilState(currentEditorialLocaleAtom);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setQuery(e.target.value);

  const handleLocaleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setLocale(e.target.value);

  const [, setCurrentEditTextValue] = useRecoilState(currentTextEditValueAtom);
  const _onKeyChange = (_: string, value: string) => {
    setCurrentEditTextValue(value);
  };
  const _onKeySubmit = (locale: string, value: string) => {
    console.log("handleOnTranslationValueChange", locale, value);
  };

  let sceneName = "loading...";
  if (repository) {
    sceneName =
      SceneRepositoryStore.find(repository.sceneId).scene.rawname ??
      "no-named scene";
  }

  useEffect(() => {
    // let mounted = true;
    if (repository) {
      console.log("fetching translations under scene", repository.sceneId);
      repository
        .fetchTranslations()
        .then((d) => {
          console.log(
            "fetched translations under scene",
            repository.sceneId,
            d
          );
          setTranslations(d);
        })
        .catch((e) => {
          console.error(e);
        });
    } else if (!repository && _translations) {
      setTranslations(_translations);
    }
  }, [repository, _translations]);

  const filteredTranslations = useMemo(() => {
    return translations.filter(({ translation: { key } }) =>
      key.includes(query)
    );
  }, [translations, query]);

  return (
    <>
      <Toolbar />
      <Header>
        <TitleWrapper>
          <Title>Key List</Title>
          <KeyLengthBadge>
            <span>{translations.length}</span>
          </KeyLengthBadge>
        </TitleWrapper>
        <ButtonList>
          <OutlineButton style={{ marginRight: 12 }}>
            <span>Select</span>
          </OutlineButton>
          <Button>
            <KeyboardIcon color="white" />
            <span style={{ width: 8 }} />
            <span>Add Key</span>
          </Button>
        </ButtonList>
      </Header>
      <KeyContainer>
        <KeyToolbar>
          <SearchInputBox value={query} onChange={handleQueryChange} />
          <Select value={locale} onChange={handleLocaleSelectChange}>
            <option value="ko">Ko</option>
            <option value="en">English</option>
            <option value="ja">JP</option>
          </Select>
        </KeyToolbar>
        <TranslationList data-is-bottom-bar-open={isBottomBarOpen && "true"}>
          {filteredTranslations.map(({ translation }, i) => {
            return (
              <EditableTextCard
                onKeySubmit={onKeySubmit ? onKeySubmit : _onKeySubmit}
                onKeyChange={onKeyChange ? onKeyChange : _onKeyChange}
                key={i}
                translation={translation}
              />
            );
          })}
        </TranslationList>
      </KeyContainer>
      {isBottomBarOpen && (
        <BottomBar
          changes={bottomBarChanges}
          onClickPublish={() => setIsConfirmOpen(true)}
        />
      )}
      <PublishModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        title="Change Publish"
      >
        Would you like to update {bottomBarChanges.toLocaleString()} changes?
      </PublishModal>
    </>
  );
};

export default SceneKeyEditor;

function EditableTextCard(props: Omit<EditableTextCardProps, "locale">) {
  const [editorialLoclae] = useRecoilState(currentEditorialLocaleAtom);

  return (
    <_EditableTextCard
      onKeyChange={props.onKeyChange}
      onKeySubmit={props.onKeySubmit}
      locale={editorialLoclae}
      {...props}
    />
  );
}

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e3e3e3;
  padding: 18px 32px;
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 24px;
  line-height: 1.2;
  color: #000000;
  width: fit-content;
  margin-right: 10px;
`;

const ButtonList = styled.div`
  display: flex;
  align-items: center;
`;

const OutlineButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 16px;
  border: 1px solid #151617;
  border-radius: 6px;
  background-color: transparent;
  height: 40px;
  cursor: pointer;

  & > span {
    font-weight: 500;
    font-size: 14px;
    line-height: 1.2;
    letter-spacing: 0.3px;
    color: #151617;
  }
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  background: #151617;
  border-radius: 6px;
  border: 0;
  height: 40px;
  cursor: pointer;

  & > span {
    font-weight: 500;
    font-size: 14px;
    line-height: 1.2;
    color: #ffffff;
  }
`;

const KeyLengthBadge = styled.div`
  width: 32px;
  height: 32px;
  background: #f5f3f3;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  & > span {
    font-weight: bold;
    font-size: 16px;
    line-height: 1.2;
    letter-spacing: 0.3px;
    color: #9b9b9b;
  }
`;

const KeyContainer = styled.div`
  padding: 24px 32px;
  overflow-y: scroll;
  width: 100%;
`;

const KeyToolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  width: 100%;
`;

const TranslationList = styled.div`
  &[data-is-bottom-bar-open="true"] {
    margin-bottom: 85px;
  }
`;
