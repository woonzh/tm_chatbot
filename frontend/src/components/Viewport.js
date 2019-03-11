import React, { Component } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import classNames from "classnames";

import { connect } from "../redux";

import { Spinner } from "./core";
import AppBar from "./AppBar";
import Drawer from "./Drawer";
import Popup from "./Popup";
import Helper from "./Helper";

export class Viewport extends Component {
  state = { open: false };
  ///////
  componentDidMount() {}
  ///////
  drawerChange = e => {
    this.setState(state => {
      global.jQuery("body").toggleClass("drawer-open");
      const open = !state.open;
      return { open };
    });
  };
  renderSpinner() {
    const hasSpinner = this.props.Spinner.show;
    if (!hasSpinner) return null;
    return <Spinner />;
  }
  renderPopup(o, i) {
    if (o instanceof Array) {
      const [popup, noclose] = o;
      if (typeof noclose === "boolean")
        return (
          <Popup key={i} data={o} noclose={noclose}>
            {popup}
          </Popup>
        );
    }
    return (
      <Popup key={i} data={o}>
        {o.view || o}
      </Popup>
    );
  }
  renderPopups() {
    const popups = this.props.Popup.items;
    if (!popups || !popups.length) return null;
    return popups.map((o, i) => this.renderPopup(o, i));
  }
  renderRoutes() {
    return this.props.routes.map((o, i) => React.cloneElement(o, { key: i }));
  }
  render() {
    const { open } = this.state;
    let hasAppBar = true;
    let hasDrawer = true;
    const { routes, currentPage } = this.props.Application;
    if (currentPage) {
      const route = routes.find(o => o.path === currentPage.props.match.path);
      if (route.hasOwnProperty("hasAppBar")) hasAppBar = route.hasAppBar;
      if (route.hasOwnProperty("hasDrawer")) hasDrawer = route.hasDrawer;
    }
    return (
      <Router>
        <div
          className={classNames(
            "navigation",
            !hasAppBar && "no-appbar",
            !hasDrawer && "no-drawer"
          )}
        >
          {hasAppBar ? (
            <AppBar isOpen={open} drawerChange={this.drawerChange} />
          ) : null}
          {hasDrawer ? (
            <Drawer isOpen={open} drawerChange={this.drawerChange} />
          ) : null}
          <div className="main-content" ref={e => (this.mainContent = e)}>
            {this.renderRoutes()}
            <Helper />
          </div>
          {this.renderPopups()}
          {this.renderSpinner()}
        </div>
      </Router>
    );
  }
}

export default connect(Viewport);
