import React from "react";
import { Divider } from "@material-ui/core";

import { Page, Space, ButtonRounded, Field } from "../components";

import { connect } from "../redux";

export class Profile extends Page {
  state = {
    editing: false,
    changingpwd: false,
    profile: {},
    passwords: {},
    preferences: { nameFormat: "title, familyName middleName givenName" }
  };

  notify = async (msg, field) => {
    await this.props.notificationNotify({
      type: "error",
      message: msg
    });
    if (this[`${field}Input`]) this[`${field}Input`].focus();
    return false;
  };

  validateProfile = async () => {
    const { profile } = this.state;
    const required = this.props.Application.profileFields.filter(
      o => o.required
    );
    for (let i = 0; i < required.length; i++) {
      const { field, label } = required[i];
      const value = profile[field];
      if (!value)
        return await this.notify(`Field '${label}' is required`, field);
    }
    return true;
  };
  async onSaveProfile() {
    if (await this.validateProfile()) {
      await this.props.api(
        this.props.apis.user.profileupdate,
        this.state.profile
      );
    }
  }
  validatePasswords = async () => {
    const { current, password, confirmed } = this.state.passwords;
    if (!current)
      return await this.notify(`Current password is missing`, "current");
    if (!password)
      return await this.notify(`New password is missing`, "password");
    if (current === password)
      return await this.notify(`New password should be different`, "password");
    if (!confirmed)
      return await this.notify(`Confirm password is missing`, "confirmed");
    if (password !== confirmed)
      return await this.notify(`Confirm password did not match`, "confirmed");
    return true;
  };
  async onSavePassword() {
    if (await this.validatePasswords()) {
      await this.props.api(
        this.props.apis.user.passwordupdate,
        this.state.passwords
      );
      this.setState({ changingpwd: false });
    }
  }

  componentDidMount() {
    const user = this.props.User.profile;
    this.setState({ ...user, profile: { ...user.profile } });
  }

  renderField(field, type, i) {
    const { editing, profile } = this.state;
    return (
      <Field
        {...field}
        key={i}
        ref={e => (this[`${field.field}Input`] = e)}
        readonly={field.hasOwnProperty("readonly") ? field.readonly : !editing}
        defaultValue="Not Set"
        value={profile[field.field]}
        onChange={e =>
          this.setState({
            [type]: {
              ...this.state[type],
              [field.field]: e.target.value
            }
          })
        }
      />
    );
  }
  renderPasswordForm() {
    const { changingpwd } = this.state;
    if (!changingpwd) return null;
    const fields = [
      {
        label: "Current Password",
        field: "current",
        type: "password",
        required: true
      },
      {
        label: "New Password",
        field: "password",
        type: "password",
        required: true
      },
      {
        label: "Confirm Password",
        field: "confirmed",
        type: "password",
        required: true
      }
    ];
    return (
      <div className="change-password-form">
        {fields.map((o, i) =>
          this.renderField({ ...o, readonly: false }, "passwords", i)
        )}
      </div>
    );
  }
  renderComponent() {
    const { editing, changingpwd } = this.state;
    const user = this.state;
    const name = this.props.User.nameFormat(user);
    const fields = this.props.Application.profileFields;
    fields.sort(
      (o1, o2) => (o1.index > o2.index ? 1 : o1.index < o2.index ? -1 : 0)
    );
    return (
      <div className="page page-profile">
        <h3>
          <div className="username">
            Hi: {name}
            <span>{user.username}</span>
          </div>
          <Space />
          <ButtonRounded
            icon={editing ? "Save" : "Edit"}
            title={editing ? "Save" : "Edit"}
            onClick={e => {
              if (!editing) this.setState({ editing: true });
              else this.onSaveProfile();
            }}
          />
          {editing ? (
            <ButtonRounded
              icon="Close"
              title="Cancel"
              onClick={e => {
                const user = this.props.User.profile;
                this.setState({ editing: false, profile: { ...user.profile } });
              }}
            />
          ) : null}
        </h3>
        <div className="page-content">
          {fields.map((o, i) => this.renderField(o, "profile", i))}
          <Divider />
          <h4>
            Change password
            <Space />
            <ButtonRounded
              icon={changingpwd ? "Save" : "Edit"}
              title={changingpwd ? "Submit" : "Click to change"}
              onClick={e => {
                if (!changingpwd) this.setState({ changingpwd: true });
                else this.onSavePassword();
              }}
            />
            {changingpwd ? (
              <ButtonRounded
                icon="Close"
                title="Cancel"
                onClick={e =>
                  this.setState({ changingpwd: false, passwords: {} })
                }
              />
            ) : null}
          </h4>
          {this.renderPasswordForm()}
        </div>
      </div>
    );
  }
}

export default connect(Profile);
