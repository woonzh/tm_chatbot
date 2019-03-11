import React, { Component } from "react";

import { connect } from "../redux";

export class NotificationItem extends Component {
  componentDidMount() {
    const { constants } = global;
    const { notificationTimeout } = constants;
    setTimeout(
      e => this.props.notificationRemove(this.props.item),
      notificationTimeout
    );
  }
  render() {
    const { item, notificationRemove } = this.props;
    let type, message, text;
    if (typeof item === "string") {
      type = "message";
      message = item;
      text = item;
    } else {
      type = item.type;
      message = item.message;
      text = item.text;
    }
    return (
      <div
        className={`notification ${type || "message"}`}
        title="Click to remove"
        onClick={e => notificationRemove(item)}
      >
        {(message || text || "").toString()}
      </div>
    );
  }
}
export default connect(NotificationItem);
