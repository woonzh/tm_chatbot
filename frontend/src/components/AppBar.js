import React, { Component } from "react";
import classNames from "classnames";
import { Toolbar, AppBar as SimpleAppBar, IconButton } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { Link } from "react-router-dom";

import { connect } from "../redux";

import UserPreferences from "./UserPreferences";
import UserProfile from "./UserProfile";
import Logout from "./Logout";
import Logo from "./Logo";
import { Button, Space } from "./core";

export class AppBar extends Component {
  renderTopmenuItem(item, i) {
    const { components } = this.props.Application;
    const { name, icon, image, path, popup, component } = item;
    const { actions, ignoredActions } = item;
    let shown = true;
    if (ignoredActions && ignoredActions.length)
      shown = !this.props.User.hasOneOfActions(...ignoredActions);
    if (actions && actions.length)
      shown = this.props.User.hasOneOfActions(...actions);
    if (!shown) return null;
    const onClick =
      popup && component && components[component]
        ? e => {
            this.popup = React.createElement(components[component], {});
            this.props.popupAdd(this.popup);
          }
        : e => this.setState({ active: item });

    const renderItem = () => (
      <div key={i} className={name.replace(/[\W]/gi, "_").toLowerCase()}>
        <Button
          transparent
          freecolor
          icon={icon}
          image={image}
          title={name}
          onClick={onClick}
        />
      </div>
    );
    if (!path) return renderItem();
    return (
      <Link to={path} key={i}>
        {renderItem()}
      </Link>
    );
  }
  renderTopmenu() {
    const { topmenu } = this.props.Application;
    return topmenu.map((o, i) => this.renderTopmenuItem(o, i));
  }
  render() {
    const { isOpen, drawerChange } = this.props;
    const isAuthenticated = this.props.Application.isAuthenticated();
    return (
      <SimpleAppBar
        position="absolute"
        color="default"
        className={classNames("appbar", isOpen && "appbar-shift")}
      >
        <Toolbar disableGutters={!isOpen}>
          <IconButton
            color="inherit"
            aria-label="Open drawer"
            onClick={drawerChange}
            className={classNames(isOpen && "hide", "burger-icon")}
          >
            <MenuIcon />
          </IconButton>
          <div className="appbar-content">
            <Logo />
            <Space />
            {isAuthenticated ? this.renderTopmenu() : null}
            {isAuthenticated ? <UserProfile /> : null}
            {isAuthenticated ? <UserPreferences /> : null}
            {isAuthenticated ? <Logout /> : null}
          </div>
        </Toolbar>
      </SimpleAppBar>
    );
  }
}
export default connect(AppBar);
