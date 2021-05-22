import "../styles/globals.css";
import { RecoilRoot } from "recoil";
import React from "react";
import QueryParamProvider from "../components/query-param-provider";

function App({ Component, pageProps }) {
  return (
    <RecoilRoot>
      <QueryParamProvider>
        <Component {...pageProps} />
      </QueryParamProvider>
    </RecoilRoot>
  );
}

export default App;
