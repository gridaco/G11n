import "../styles/globals.css";
import { RecoilRoot } from "recoil";

function App({ Component, pageProps }) {
  return (
    <RecoilRoot>
      <Component {...pageProps} />
    </RecoilRoot>
  );
}

export default App;
