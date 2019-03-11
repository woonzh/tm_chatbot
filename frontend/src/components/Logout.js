import React, { Component } from "react";

import { connect } from "../redux";

import { Button } from "./core";

export class Setting extends Component {
  async onLogout() {
    await this.props.api(this.props.apis.user.logout);
    await this.props.applicationLogout();
  }
  render() {
    return (
      <div className="user-logout">
        <Button
          transparent
          freecolor
          icon="fas fa-sign-out-alt"
          title="Logout"
          onClick={e => this.onLogout()}
        />
      </div>
    );
  }
}

export default connect(Setting);
