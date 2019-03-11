import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Tabs, Tab, Paper } from "@material-ui/core";
import { FormControl, Select, Input } from "@material-ui/core";
import { Chip, MenuItem } from "@material-ui/core";

import { connect } from "../redux";
import { emailCheck } from "../utils";

import { Button, Icon } from "./core";
import Field from "./Field";

const TabAction = withStyles({
  root: {
    flex: 1,
    maxWidth: "initial"
  },
  wrapper: {
    alignItems: "flex-end",
    paddingRight: 24
  }
})(Tab);

export class UserDetail extends Component {
  state = {
    currentTab: "Profile",
    confirmed: "",
    username: "",
    password: "",
    groups: [],
    profile: {},
    preferences: {}
  };
  get accountFields() {
    return this.props.Application.accountFields;
  }
  get profileFields() {
    if (!this._profileFields) {
      this._profileFields = this.props.Application.profileFields;
      this._profileFields.sort(
        (o1, o2) => (o1.index > o2.index ? 1 : o1.index < o2.index ? -1 : 0)
      );
    }
    return this._profileFields;
  }
  get preferencesFields() {
    return this.props.Application.preferencesFields;
  }
  get userid() {
    return this.props.match.params.id;
  }
  get isNew() {
    const { userid } = this;
    return userid && userid === "new";
  }
  onChangeAccountField = name => e => this.setState({ [name]: e.target.value });
  onChangeProfileField = name => e =>
    this.setState({
      profile: { ...this.state.profile, [name]: e.target.value }
    });
  onChangePreferencesField = name => e =>
    this.setState({
      preferences: { ...this.state.preferences, [name]: e.target.value }
    });
  onChangeGroup = e => this.setState({ groups: e.target.value });
  onChangePassword = async () => {
    const passwordOk = await this.validatePasswords();
    if (passwordOk) {
      const user = this.props.User.detail;
      const { password, confirmed } = this.state;
      await this.props.api(
        { ...this.props.apis.user.password, path: [user.id] },
        { password, confirmed }
      );
    }
  };
  onChangeGroups = async () => {
    const user = this.props.User.detail;
    await this.props.api(
      { ...this.props.apis.user.savegroups, path: [user.id] },
      { groups: this.state.groups }
    );
  };
  onChangeProfile = async () => {
    const user = this.props.User.detail;
    await this.props.api(
      { ...this.props.apis.user.saveprofile, path: [user.id] },
      this.state.profile
    );
  };
  onChangePreferences = async () => {
    const user = this.props.User.detail;
    await this.props.api(
      { ...this.props.apis.user.savepreferences, path: [user.id] },
      this.state.preferences
    );
  };
  validateUsername = async () => {
    const { username } = this.state;
    if (!username) {
      await this.props.notificationNotify({
        type: "error",
        message: "Please enter your email, Account tab"
      });
      return false;
    }
    if (!emailCheck(username)) {
      await this.props.notificationNotify({
        type: "error",
        message: "Please enter a valid email, Account tab"
      });
      return false;
    }
    return true;
  };
  validatePasswords = async () => {
    const { password, confirmed } = this.state;
    if (!password) {
      await this.props.notificationNotify({
        type: "error",
        message: "Password is missing, Account tab"
      });
      return false;
    }
    if (!confirmed) {
      await this.props.notificationNotify({
        type: "error",
        message: "Confirm Password is missing, Account tab"
      });
      return false;
    }
    if (password !== confirmed) {
      await this.props.notificationNotify({
        type: "error",
        message: "Passwords don't match, Account tab"
      });
      return false;
    }
    return true;
  };
  validateGroups = async () => {
    const { groups } = this.state;
    if (!groups || !groups.length) {
      await this.props.notificationNotify({
        type: "error",
        message: "Please assign user to a group, Groups tab"
      });
      return false;
    }
    return true;
  };
  validateProfile = async () => {
    const { profile } = this.state;
    const required = this.profileFields.filter(o => o.required);
    for (let i = 0; i < required.length; i++) {
      const { field, label } = required[i];
      const value = profile[field];
      if (!value) {
        await this.props.notificationNotify({
          type: "error",
          message: `Field '${label}' is required, Profile tab`
        });
        return false;
      }
    }
    return true;
  };
  validatePreferences = async () => {
    const { preferences } = this.state;
    const required = this.preferencesFields.filter(o => o.required);
    for (let i = 0; i < required.length; i++) {
      const { field, label } = required[i];
      const value = preferences[field];
      if (!value) {
        await this.props.notificationNotify({
          type: "error",
          message: `Field '${label}' is required, Preferences tab`
        });
        return false;
      }
    }
    return true;
  };
  onCreateUser = async () => {
    const usernameOk = await this.validateUsername();
    const passwordOk = await this.validatePasswords();
    const groupsOk = await this.validateGroups();
    const profileOk = await this.validateProfile();
    const preferencesOk = await this.validatePreferences();
    if (usernameOk && passwordOk && groupsOk && profileOk && preferencesOk) {
      const user = await this.props.api(
        this.props.apis.user.create,
        Object.omit(this.state, "currentTab")
      );
      if (user && !user.error)
        await this.props.history.replace(`/users/${user.id}`);
    }
  };
  onDeleteUser = async () => {
    const user = this.props.User.detail;
    await this.props.popupAdd({
      confirm: async () => {
        await this.props.api({
          ...this.props.apis.user.remove,
          path: [user.id]
        });
        await this.props.userRemove(user);
        await this.props.history.goBack();
      },
      view: `Are you sure to remove '${user.username}'?`
    });
  };

  async componentDidMount() {
    const { isNew } = this;
    const { profileFields, preferencesFields } = this;
    this.setState(
      {
        profile: profileFields.reduce((rs, o) => {
          rs[o.field] = o.value || o.defaultValue || "";
          return rs;
        }, {}),
        preferences: preferencesFields.reduce((rs, o) => {
          rs[o.field] = o.value || o.defaultValue || "";
          return rs;
        }, {})
      },
      async () => {
        if (!isNew) {
          const { userid } = this;
          await this.props.api({
            ...this.props.apis.user.detail,
            path: [userid]
          });
          const user = this.props.User.detail;
          await this.setState({
            ...this.state,
            ...user,
            groups: user.groups.map(o => o.id)
          });
          await this.setState({ isNew: false });
        }
      }
    );
  }

  renderField(obj, o, i) {
    const { classes } = this.props;
    const { isNew, field, defaultValue } = o;
    if (isNew && !this.isNew) return null;
    const value =
      obj === "Account" ? this.state[field] : this.state[obj.lcfirst()][field];
    return (
      <Field
        {...o}
        key={i}
        ref={e => (this[`${o.field}Input`] = e)}
        classes={classes}
        defaultValue={defaultValue}
        value={value}
        onChange={this[`onChange${obj}Field`](field)}
      />
    );
  }
  renderGroups() {
    const { classes, User } = this.props;
    const { groups } = User;
    return (
      <Paper className={classes.section} elevation={1}>
        <FormControl className={classes.groupFormControl}>
          <label htmlFor="select-multiple-chip">Assign user to group(s)</label>
          <Select
            multiple
            value={this.state.groups}
            onChange={this.onChangeGroup}
            input={<Input id="select-multiple-chip" />}
            renderValue={selected => (
              <div className={classes.chips}>
                {selected.map(id => (
                  <Chip
                    key={id}
                    label={groups.find(o => o.id === id).name}
                    className={classes.chip}
                  />
                ))}
              </div>
            )}
          >
            {groups.map(o => (
              <MenuItem key={o.id} value={o.id}>
                {o.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {this.isNew ? null : (
          <div className="actions">
            <Button
              text="Save Group(s)"
              className="cyan"
              onClick={e => this.onChangeGroups()}
            />
          </div>
        )}
      </Paper>
    );
  }
  renderPreferences() {
    const { classes } = this.props;
    return (
      <Paper className={classes.section} elevation={1}>
        {this.preferencesFields.map((o, i) =>
          this.renderField("Preferences", o, i)
        )}
        {this.isNew ? null : (
          <div className="actions">
            <Button
              text="Save Preferences"
              className="cyan"
              onClick={e => this.onChangePreferences()}
            />
          </div>
        )}
      </Paper>
    );
  }
  renderProfile() {
    const { classes } = this.props;
    const { profileFields } = this;
    return (
      <Paper className={classes.section} elevation={1}>
        <div className="horizontal center top">
          <div style={{ flex: 1, marginRight: 24 }}>
            {profileFields
              .filter(o => !o.right)
              .map((o, i) => this.renderField("Profile", o, i))}
          </div>
          <div style={{ flex: 1 }}>
            {profileFields
              .filter(o => o.right)
              .map((o, i) => this.renderField("Profile", o, i))}
          </div>
        </div>
        {this.isNew ? null : (
          <div className="actions">
            <Button
              text="Save Profile"
              className="cyan"
              onClick={e => this.onChangeProfile()}
            />
          </div>
        )}
      </Paper>
    );
  }
  renderAccount() {
    const { classes } = this.props;
    return (
      <Paper className={classes.section} elevation={1}>
        <form>
          {this.accountFields.map((o, i) => this.renderField("Account", o, i))}
          {this.isNew ? null : (
            <div className="actions">
              <Button
                text="Change Password"
                className="cyan"
                onClick={e => this.onChangePassword()}
              />
            </div>
          )}
        </form>
      </Paper>
    );
  }
  renderTabContainer() {
    const { currentTab } = this.state;
    return this[`render${currentTab}`]();
  }
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        <Tabs
          value={this.state.currentTab}
          onChange={(e, v) =>
            v !== "Actions" ? this.setState({ currentTab: v }) : false
          }
          className={classes.tabs}
        >
          <Tab value="Account" label="Account" />
          <Tab value="Groups" label="Groups" />
          <Tab value="Profile" label="Profile" />
          <Tab value="Preferences" label="Preferences" />
          {!this.isNew ? (
            <TabAction
              value="Actions"
              icon={<Icon icon="Delete" onClick={e => this.onDeleteUser()} />}
            />
          ) : (
            <TabAction
              value="Actions"
              icon={
                <Icon icon="SaveRounded" onClick={e => this.onCreateUser()} />
              }
            />
          )}
        </Tabs>
        {this.renderTabContainer()}
      </div>
    );
  }
}

export default connect(
  UserDetail,
  true,
  theme => ({
    container: {
      display: "flex",
      flexWrap: "wrap"
    },
    tabs: { width: "100%" },
    section: {
      ...theme.mixins.gutters(),
      width: "100%",
      paddingTop: theme.spacing.unit * 2,
      paddingBottom: theme.spacing.unit * 2,
      marginBottom: theme.spacing.unit * 2,
      marginLeft: theme.spacing.unit * 0,
      marginRight: theme.spacing.unit * 0
    },
    subsection: {
      marginLeft: theme.spacing.unit * 1,
      marginRight: theme.spacing.unit * 1
    },
    dense: {
      marginTop: 19
    },
    menu: {
      width: 200
    },
    groupFormControl: {
      margin: theme.spacing.unit,
      width: "100%"
    },
    chips: {
      display: "flex",
      flexWrap: "wrap"
    },
    chip: {
      margin: theme.spacing.unit / 4
    },
    noLabel: {
      marginTop: theme.spacing.unit * 3
    }
  })
);
