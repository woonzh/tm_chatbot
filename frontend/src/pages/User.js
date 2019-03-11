import React from "react";

import { Page, UserDetail, ButtonRounded } from "../components";
import { connect } from "../redux";

export class User extends Page {
  get userid() {
    return this.props.match.params.id;
  }
  get isNew() {
    const { userid } = this;
    return userid && userid === "new";
  }
  renderForm() {
    return <UserDetail />;
  }
  renderComponent() {
    const user = this.props.User.detail;
    const name = global.store.getState().User.nameFormat(user);
    return (
      <div className="page page-user">
        <h3>
          <ButtonRounded
            title="Back to users list"
            icon="KeyboardBackspace"
            onClick={e => this.props.history.goBack()}
          />
          {this.isNew ? `New account` : `Account: ${name}`}
        </h3>
        <div className="page-content">{this.renderForm()}</div>
      </div>
    );
  }
}

export default connect(User);
