import React, { Component } from "react";
import classNames from "classnames";

import { connect } from "../redux";

import { Button, ButtonRounded } from "./core";

export class Popup extends Component {
  get noclose() {
    if (this.props.hasOwnProperty("noclose")) return this.props.noclose;
    return this.getProp("noclose");
  }
  async componentDidUpdate(prevProps) {
    const { data, applicationOnRemoveLastPopup, Application } = this.props;
    const { removingLastPopup } = Application;
    if (removingLastPopup) {
      const popups = this.props.Popup.items;
      const idx = popups.indexOf(data);
      if (popups.length - 1 === idx) {
        await applicationOnRemoveLastPopup(false);
        await this.onClose(null, true);
      }
    }
  }

  getProp = name => {
    const { data } = this.props;
    let p = data[name];
    if (!p && data.props) p = data.props[name];
    if (!p && data.length) p = data[0].props[name];
    return p;
  };
  onClose = async (e, removingLastPopup, ...args) => {
    const onBeforeClose = this.getProp("onBeforeClose");
    let canClose = true;
    if (onBeforeClose)
      canClose = await onBeforeClose(e, removingLastPopup, ...args);
    if (canClose !== false) {
      const onClose = this.getProp("onClose");
      if (onClose) await onClose(e, removingLastPopup, ...args);
      const popups = this.props.Popup.items;
      //close this popup if it is the last one
      const { data, popupRemove } = this.props;
      const idx = popups.indexOf(data);
      if (popups.length - 1 === idx) {
        await popupRemove(data);
        const onAfterClose = this.getProp("onAfterClose");
        if (onAfterClose) await onAfterClose(e, removingLastPopup, ...args);
      }
    }
  };

  renderIconClose(noclose) {
    if (noclose) return null;
    return (
      <ButtonRounded
        icon="Close"
        className="close"
        title="Cancel"
        onClick={this.onClose}
      />
    );
  }
  renderConfirm(confirm) {
    const { children } = this.props;
    const className = this.getProp("className");
    return (
      <div className={classNames("overlay", className)}>
        <div className="popup confirm-box">
          {this.renderIconClose()}
          <div className="content">
            {children}
            <div className="bottom-actions">
              <Button
                text="Confirm"
                onClick={async (e, removingLastPopup, ...args) => {
                  await this.onClose(e, removingLastPopup, ...args);
                  await confirm(e, removingLastPopup, ...args);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
  render() {
    const confirm = this.getProp("confirm");
    if (confirm) return this.renderConfirm(confirm);

    const { children } = this.props;
    const className = this.getProp("className");
    return (
      <div
        className={classNames(
          "overlay",
          className ? `overlay-${className}` : ""
        )}
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        {children}
        {this.renderIconClose(this.noclose)}
      </div>
    );
  }
}

export default connect(Popup);
