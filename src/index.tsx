import { render } from "react-dom";
import { StoresProvider, stores } from "./stores";

import { App } from "./App";
import { BrowserRouter } from "react-router-dom";

const rootElement = document.getElementById("root");
render(
  <BrowserRouter>
    <StoresProvider value={stores}>
      <App />
    </StoresProvider>
  </BrowserRouter>,
  rootElement
);
