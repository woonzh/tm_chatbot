import React, { Component } from "react";

import { connect } from "../redux";

import NotificationItem from "./NotificationItem";

export class Notification extends Component {
  renderNotifications() {
    const items = this.props.Notification.items;
    return items.map((item, i) => <NotificationItem item={item} key={i} />);
  }
  render() {
    return <div className="notifications">{this.renderNotifications()}</div>;
  }
}
export default connect(Notification);
