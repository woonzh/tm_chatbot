import React, { Component } from "react";
import { Divider, IconButton, Drawer as MDrawer } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { Link } from "react-router-dom";
import classNames from "classnames";

import { connect } from "../redux";

import { Icon } from "./core";

const { location } = global;

export class Drawer extends Component {
  renderSubmenu(item) {
    const { children } = item;
    if (!children) return null;
    return (
      <div key="submenu" className="menu-items">
        {children.map((o, i) => this.renderItem(o, i))}
      </div>
    );
  }
  renderItem(item, i) {
    const { name, description, path, className, popup, component } = item;
    const { children, actions, ignoredActions, icon, activeIcon } = item;
    let shown = true;
    if (ignoredActions && ignoredActions.length)
      shown = !this.props.User.hasOneOfActions(...ignoredActions);
    if (actions && actions.length)
      shown = this.props.User.hasOneOfActions(...actions);
    if (!shown) return null;

    const { components } = this.props.Application;
    const { pathname } = location;
    let isActive = false;
    if (pathname === "/" && path === "/") {
      isActive = true;
    } else {
      if (path !== "/" && pathname.indexOf(path) === 0) {
        isActive = true;
      }
    }
    const onClick =
      popup && component && components[component]
        ? e => {
            this.popup = React.createElement(components[component], {});
            this.props.popupAdd(this.popup);
          }
        : e => false;
    const isImage = /.+\.\w{1,5}$/g.test(icon);
    const classes = classNames(
      "menu-item",
      children ? "has-children" : "",
      className,
      isActive ? "active" : "",
      icon ? "has-icon" : ""
    );
    const title = `${name}${description ? `, ${description}` : ""}`;
    const props = { key: i, title, onClick, className: classes };
    if (isImage)
      props.style = {
        "--icon": `url("${icon}")`,
        "--active-icon": `url("${activeIcon || icon}")`
      };
    else props["data-icon"] = icon;
    const renderChildren = () =>
      isImage
        ? [
            <div key="name" className="name">
              {name}
            </div>,
            this.renderSubmenu(item)
          ]
        : [
            <Icon key="icon" icon={icon} />,
            <div key="name" className="name">
              {name}
            </div>,
            this.renderSubmenu(item)
          ];
    const renderItem = path =>
      path ? (
        <Link {...props} to={path}>
          {renderChildren()}
        </Link>
      ) : (
        <div {...props}>{renderChildren()}</div>
      );
    return renderItem(path);
  }
  renderMenuItems() {
    const menu = this.props.Application.menu;
    const isAuthenticated = this.props.Application.isAuthenticated();
    return menu
      .filter(o => {
        return (
          !o.hidden &&
          ((isAuthenticated && o.private !== false) ||
            (!isAuthenticated && o.public))
        );
      })
      .map((o, i) => this.renderItem(o, i));
  }
  render() {
    const { isOpen, drawerChange } = this.props;
    return (
      <MDrawer
        variant="permanent"
        className="drawer"
        classes={{
          paper: classNames("drawer-main", isOpen && "drawer-main-open")
        }}
        open={isOpen}
      >
        <div className="drawer-open-close">
          <IconButton onClick={drawerChange}>
            <Close className="drawer-cross" />
          </IconButton>
        </div>
        <Divider className="drawer-divider" />
        <div className="menu-items">{this.renderMenuItems()}</div>
      </MDrawer>
    );
  }
}

export default connect(Drawer);
