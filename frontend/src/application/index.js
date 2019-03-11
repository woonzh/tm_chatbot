import React, { Component, Fragment } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Provider } from "react-redux";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import PropTypes from "prop-types";

import { connect } from "../redux";
import * as components from "../components";
import { PrivateRoute, PublicRoute } from "../components";
import { Viewport, Notification } from "../components";
import * as pages from "../pages";

import theme from "../theme";

/**
 * @class
 * @classdesc Main application
 */
export class Application extends Component {
  static propTypes = {
    /** @description store */
    store: PropTypes.object.isRequired,
    /** @description Application which bound from store, should contains {routes, menu} */
    Application: PropTypes.object.isRequired,
    /** @description apis a set of APIs settings */
    apis: PropTypes.object.isRequired,
    /** @description popupRemoveLast function to remove last popup */
    popupRemoveLast: PropTypes.func.isRequired
  };

  get store() {
    return this.props.store;
  }
  get theme() {
    return this.props.theme || createMuiTheme(theme);
  }
  get routes() {
    const { routes, menu } = this.props.Application;
    const items = routes;
    menu.forEach(o => {
      const { path } = o;
      if (path) {
        const found = items.find(r => r.path === path);
        if (!found) {
          items.push({ ...o, public: false });
        }
      }
    });
    return items.map((o, i) => {
      const component = pages[o.component] || pages.Default;
      const props = { ...o, key: i, component, exact: true };
      return o.public ? (
        <PublicRoute {...props} redux={this.props} />
      ) : (
        <PrivateRoute {...props} redux={this.props} />
      );
    });
  }

  async componentDidMount() {
    await global.addEventListener("keydown", this.onKeypress, false);
    await this.props.applicationSetComponents(components);
    const isAuthenticated = this.props.Application.isAuthenticated();
    if (isAuthenticated) {
      await this.props.api(this.props.apis.user.profile);
      await this.props.api(this.props.apis.user.groups);
      await this.props.api(this.props.apis.user.actions);
    }
    await this.props.api(this.props.apis.application.fetch);
    await this.props.api(this.props.apis.application.icons);
    await this.subscribe();
  }
  async componentWillUnmount() {
    await global.removeEventListener("keydown", this.onKeypress, false);
  }
  async subscribe() {}

  onEnter = async e => {
    await this.props.applicationOnEnter(true);
  };
  onEscape = async e => {
    await this.props.applicationOnRemoveLastPopup(true);
  };
  onKeypress = async e => {
    const { keyCode } = e;
    if ([13, 27].includes(keyCode)) {
      // e.preventDefault();
      if (keyCode === 13) await this.onEnter(e);
      if (keyCode === 27) await this.onEscape(e);
    }
  };

  render() {
    const { store, routes, theme } = this;
    return (
      <Provider store={store}>
        <MuiThemeProvider theme={theme}>
          <Fragment>
            <CssBaseline />
            <Viewport routes={routes} />
            <Notification />
          </Fragment>
        </MuiThemeProvider>
      </Provider>
    );
  }
}

export default connect(Application);
