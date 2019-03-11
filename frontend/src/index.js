import "./scss/index.scss";

import React from "react";
import ReactDOM from "react-dom";
import { createMuiTheme } from "@material-ui/core/styles";

import global from "./globals";

import theme from "./theme";
import { store } from "./redux";
import Application from "./application";
import * as serviceWorker from "./serviceWorker"; //only for webpack

const { constants } = global;
constants.runversion = new Date().getTime();

const { tokenName } = constants;
global.store = store;
store.dispatch({
  type: "application.LoadToken",
  payload: localStorage.getItem(tokenName)
});

ReactDOM.render(
  <Application store={store} theme={createMuiTheme(theme)} />,
  document.getElementById("root")
);

serviceWorker.unregister();
