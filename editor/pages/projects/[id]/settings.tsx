import { useRouter } from "next/router";
import React from "react";
import Axios from "axios";
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

  const saveProject = (project: {
    id: string;
    name: string;
    locales: string[];
  }) => {
    delete project.id;
    client.patch(`/projects/${id}/settings`, project);
  };

  const deleteProject = (id: string) => {
    client.delete(`/projects/${id}`).then(() => {
      router.push("/projects");
    });
  };

  React.useEffect(() => {
    client.get(`/projects/${id}`).then((res) => {
      dispatch(
        setProjectData({
          projectId: res.data.id,
          projectName: res.data.name,
          locales: res.data.locales,
        })
      );
    });
  }, []);

  const locales = ["en", "ko", "ja"];

  return (
    <div
      style={{
        padding: 40,
      }}
    >
      <button onClick={() => router.back()}>back</button>
      <h1>{project?.projectName || ""} Settings</h1>
      Project Name:{" "}
      <input
        type="text"
        onChange={(e) =>
          dispatch(
            setProjectData({
              projectName: e.target.value,
            })
          )
        }
        value={project?.projectName || ""}
      />
      <br />
      Locales:
      {locales.map((locale: string, i: number) => {
        const isUsing = project?.locales.includes(locale) || false;
        return (
          <div key={i}>
            <input
              type="checkbox"
              name={locale}
              value={locale}
              onChange={(e) => {
                if (e.target.checked) {
                  dispatch(
                    setProjectData({
                      locales: [...project.locales, locale],
                    })
                  );
                } else {
                  dispatch(
                    setProjectData({
                      locales: project.locales.filter(
                        (l: string) => l !== locale
                      ),
                    })
                  );
                }
              }}
              checked={isUsing}
            />
            {locale}
          </div>
        );
      })}
      <button
        onClick={() =>
          saveProject({
            id: project.projectId,
            name: project.projectName,
            locales: project.locales,
          })
        }
      >
        save
      </button>
      <button
        style={{
          backgroundColor: "red",
          color: "lightyellow",
          marginLeft: 5,
        }}
        onClick={() => deleteProject(project.projectId)}
      >
        delete project
      </button>
    </div>
  );
}
