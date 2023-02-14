import { useRouter } from "next/router";
import React from "react";
import Axios from "axios";
import BackButton from "components/button/back";

const client = Axios.create({
  baseURL: "http://localhost:3307",
});
export default function () {
  const router = useRouter();
  const { id } = router.query;
  const exportProjectToJson = (projectId: string) => {
    client
      .get(`/projects/${projectId}/export`, {
        responseType: "blob",
      })
      .then((res) => {
        const href = URL.createObjectURL(res.data);
        const link = document.createElement("a");
        link.href = href;
        link.setAttribute("download", "translations.zip");
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(href);
      });
  };
  const exportProjectToCsv = (projectId: string) => {};
  return (
    <div style={{ padding: 40 }}>
      <BackButton url="/projects"></BackButton>
      <h1>Download {id} </h1>
      <button onClick={() => exportProjectToJson(id as string)}>
        Download Json
      </button>
      <br />
      <button onClick={() => exportProjectToCsv(id as string)}>
        Download Csv(not working)
      </button>
    </div>
  );
}
