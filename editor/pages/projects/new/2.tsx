import React from "react";
import Axios from "axios";
import { useRouter } from "next/router";
import { Button, TextFormField } from "@editor-ui/console";
import styled from "@emotion/styled";
import { useSelector, useDispatch } from "react-redux";
import { RootState, setNewProjectData } from "core/store";

const client = Axios.create({
  baseURL: "http://localhost:3307",
});

const Page = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100vh;
  margin: auto;
  max-width: 850px;
`;

const FormPart = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
  width: 340px;
  max-height: 650px;
`;

const RenderPart = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
  width: 471px;
  max-height: 650px;
`;

const RenderingArea = styled.div`
  background-color: lightgray;
  width: 100%;
  height: 95%;
`;

const LocaleContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
`;

const Locale = styled.div`
  background-color: rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 16px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 2px 8px;
  min-height: 17px;
  min-width: 30px;
  margin: 0 5px 5px 5px;
  font-family: "Inter";
  font-style: normal;
  font-weight: 500;
  font-size: 11px;
  line-height: 13px;
`;
const Comment = styled.p`
  color: rgba(0, 0, 0, 0.6);
  font-size: 11px;
  font-family: Inter;
  font-style: normal;
  font-weight: 400;
  margin: 10px 0 10px 0;
`;

export default function setLocales() {
  const newProject = useSelector((state: RootState) => state.newProject.data);
  const dispatch = useDispatch();
  const router = useRouter();

  const [locale, setLocale] = React.useState<string>("");
  const [input, setInput] = React.useState<string>("");

  const addLocale = (locale: any) => {
    if (newProject?.locales?.includes(locale)) return;
    dispatch(setNewProjectData({ locales: [...newProject?.locales, locale] }));
    setInput("");
  };

  const deleteLocale = (e: any) => {
    const locale = e.target.id;
    const locales = newProject?.locales.filter((l) => l !== locale);
    dispatch(
      setNewProjectData({
        locales,
      })
    );
  };

  const onSaveClick = async () => {
    if (newProject?.locales?.length === 0) {
      alert("Please add at least one locale");
      return;
    }
    dispatch(setNewProjectData({ defaultLocale: newProject?.locales[0] }));
    router.push(`/projects/new/3`);
  };

  const onLocaleClick = (e: any) => {
    const locale = e.target.id;
    setLocale(locale);
  };

  return (
    <Page>
      <FormPart>
        <h3>grida.co</h3>
        <div>
          <h2>Locales</h2>
          <div style={{ height: 20 }}></div>
          <TextFormField
            label="Search Locales to add"
            placeholder="English"
            onEnter={addLocale}
            onChange={setInput}
            value={input || ""}
          />
          <div style={{ height: 20 }}></div>

          <Comment>
            💡 Drag & Drop to change default locale & preference
          </Comment>
          <LocaleContainer>
            {newProject?.locales?.map((locale, i) => {
              return (
                <Locale
                  key={i}
                  id={locale}
                  draggable="true"
                  onClick={deleteLocale}
                >
                  {locale}
                  {i === 0 && " (default)"}
                </Locale>
              );
            })}
          </LocaleContainer>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button width="165px" onClick={onSaveClick}>
            Save & Continue
          </Button>
          <Comment>1 of 3</Comment>
        </div>
      </FormPart>
      <RenderPart>
        <LocaleContainer>
          {newProject?.locales?.map((locale, i) => {
            return (
              <Locale key={i} onClick={onLocaleClick}>
                {locale}
              </Locale>
            );
          })}
        </LocaleContainer>
        <RenderingArea>Rendering area</RenderingArea>
      </RenderPart>
    </Page>
  );
}
