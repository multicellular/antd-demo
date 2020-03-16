import React from "react";
import ReactDOM from "react-dom";
import "./index.less";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import HookProvider from "@stores/HookProvider";

ReactDOM.render(
  <HookProvider>
    <App />
  </HookProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
