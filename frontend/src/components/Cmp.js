import { Component } from "react";

class Cmp extends Component {
  get apis() {
    return global.apis;
  }
  get actions() {
    return global.actions;
  }
  get api() {
    return this.actions.api;
  }
  get store() {
    return global.store.getState();
  }
}

export default Cmp;
