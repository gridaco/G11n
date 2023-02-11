import { useRouter } from "next/router";
import React from "react";
import Axios from "axios";
import langs from "langs";
import Select from "react-select";
import styled from "@emotion/styled";

const client = Axios.create({
  baseURL: "http://localhost:3307",
});

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

export default function () {
  const router = useRouter();
  let id = "";
  const [project, setProject] = React.useState<any>({ name: "", locales: [] });
  const [locales, setLocales] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (router && router.query && router.query.id) {
      id = router.query.id as string;
      client.get(`/projects/${id}`).then((res) => {
        setProject(res.data);
        setLocales(res.data.locales);
      });
    }
  }, [router]);

  const langOptions = langs.all().map((l) => {
    return { value: l[1], label: `${l.local} (${l.name} / ${l[1]})` };
  });

  const addLocale = (locale: any) => {
    if (locales.includes(locale)) return;
    setLocales([...locales, locale]);
  };
  const deleteLocale = (e: any) => {
    const locale = e.target.id;
    setLocales(locales.filter((l) => l !== locale));
  };
  const saveProject = (project: {
    id: string;
    name: string;
    locales: string[];
  }) => {
    delete project.id;
    client.patch(`/projects/${id}/settings`, {
      ...project,
      locales,
    });
  };

  const deleteProject = (id: string) => {
    client.delete(`/projects/${id}`).then(() => {
      router.push("/projects");
    });
  };

  return (
    <div
      style={{
        padding: 40,
      }}
    >
      <svg
        width="40"
        height="40"
        viewBox="0 0 15 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        onClick={() => router.push(`/projects`)}
        style={{
          cursor: "pointer",
          backgroundColor: "white",
          border: "1px solid black",
          borderRadius: 3,
        }}
      >
        <path
          d="M6.85355 3.14645C7.04882 3.34171 7.04882 3.65829 6.85355 3.85355L3.70711 7H12.5C12.7761 7 13 7.22386 13 7.5C13 7.77614 12.7761 8 12.5 8H3.70711L6.85355 11.1464C7.04882 11.3417 7.04882 11.6583 6.85355 11.8536C6.65829 12.0488 6.34171 12.0488 6.14645 11.8536L2.14645 7.85355C1.95118 7.65829 1.95118 7.34171 2.14645 7.14645L6.14645 3.14645C6.34171 2.95118 6.65829 2.95118 6.85355 3.14645Z"
          fill="currentColor"
          fillRule="evenodd"
          clipRule="evenodd"
        ></path>
      </svg>{" "}
      <h1>{project.name} Settings</h1>
      Project Name:{" "}
      <input
        type="text"
        onChange={(e) => setProject({ ...project, name: e.target.value })}
        value={project.name || ""}
      />
      <br />
      Locales:
      <Select
        instanceId="langs"
        options={langOptions}
        onChange={(e) => {
          addLocale(e.value);
        }}
      />
      <LocaleContainer
        //TODO: Drag & Drop
        onDrop={(e) => {
          e.preventDefault();
          const data = e.dataTransfer.getData("text/plain");

          // setLocales(newLocales);
        }}
      >
        {locales.map((locale, i) => {
          return (
            <Locale
              id={locale}
              key={i}
              draggable="true"
              onClick={deleteLocale}
              onDragStart={(e) => {
                e.dataTransfer.setData("text/plain", locale);
              }}
            >
              {locale}
              {i === 0 && (
                <p
                  style={{
                    color: "rgba(0, 0, 0, 0.6)",
                    fontSize: "11px",
                    margin: "0 0 0 5px",
                    zIndex: -1,
                  }}
                >
                  default
                </p>
              )}
            </Locale>
          );
        })}
      </LocaleContainer>
      <button onClick={() => saveProject(project)}>save</button>
      <button
        style={{
          backgroundColor: "red",
          color: "lightyellow",
          marginLeft: 5,
        }}
        onClick={() => deleteProject(project.id)}
      >
        delete project
      </button>
    </div>
  );
}
