import React from "react";
import Appbar from "../components/appbar/default-appbar";
import { LinearProgress } from "@mui/material";
import Head from "next/head";

export function DefaultScaffoldLayoyt(props: {
  loading?: boolean;
  title?: string;
  children?: JSX.Element;
}) {
  if (props.loading) {
    return (
      <div>
        <Appbar
          title={"Loading..."}
          backButton="DASHBOARD"
          onClickShare={() => {
            navigator.clipboard.writeText(window.location.href);
            alert("copied to clipboard");
          }}
          onClickPlay={() => {}}
        />
        <LinearProgress
          style={{
            alignContent: "center",
          }}
        />
      </div>
    );
  }

  return (
    <div>
      <Appbar
        title={props.title}
        backButton="DASHBOARD"
        onClickShare={() => {
          navigator.clipboard.writeText(window.location.href);
          alert("copied to clipboard");
        }}
        onClickPlay={() => {}}
      />
      <Head>
        <title>G11n by Grida</title>
      </Head>
      <main>{props.children}</main>
    </div>
  );
}
