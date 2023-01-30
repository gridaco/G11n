import "../styles/globals.css";
import { RecoilRoot } from "recoil";
import React from "react";
import QueryParamProvider from "components/query-param-provider";
import store from "core/store";
import { Provider } from "react-redux";

const App = ({ Component, pageProps }) => {
  return (
    <RecoilRoot>
      <Provider store={store}>
        <QueryParamProvider>
          <Component {...pageProps} />
        </QueryParamProvider>
      </Provider>
    </RecoilRoot>
  );
};

export default App;
