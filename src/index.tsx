import { render } from "react-dom";
import { StoresProvider, stores } from "./stores";
import { ReactNotifications } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";

import { App } from "./App";
import { BrowserRouter } from "react-router-dom";

const rootElement = document.getElementById("root");
render(
  <BrowserRouter>
    <StoresProvider value={stores}>
      <ReactNotifications />
      <App />
    </StoresProvider>
  </BrowserRouter>,
  rootElement
);
