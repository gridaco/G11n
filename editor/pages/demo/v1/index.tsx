import React from "react";
import Axios from "axios";

const client = Axios.create({
  baseURL: "http://localhost:3307",
});

export default function() {
  const [projectId, setProjectId] = React.useState<string>("");

  const [keys, setKeys] = React.useState<any[]>([]);

  const onCreateNewKey = (key: string) => {
    const data = {
      key,
      projectId: projectId,
    };
    client.post("/texts", data).then((res) => {
      setKeys([...keys, res.data]);
    });
    // alert("key created: " + key);
  };

  return (
    <div
      style={{
        padding: 40,
      }}
    >
      <h1>V1 Playground {projectId}</h1>
      <div>
        <input
          placeholder="projectId"
          onChange={(e) => {
            setProjectId(e.target.value);
          }}
        />
      </div>
      <CreateKeyView onSubmit={onCreateNewKey} />
      {keys.map((key, i) => {
        return <p key={i}>{JSON.stringify(key)}</p>;
      })}
    </div>
  );
}

function CreateKeyView({ onSubmit }: { onSubmit: (key: string) => void }) {
  const [key, setKey] = React.useState<string>("");

  return (
    <>
      <p>preview = {key.length == 0 ? "empty" : key}</p>
      <input
        placeholder="key"
        onChange={(e) => {
          setKey(e.target.value);
        }}
      />
      <button
        onClick={() => {
          onSubmit(key);
        }}
      >
        create
      </button>
    </>
  );
}
