import React from "react";
import { Page, Button } from "../components";
import { connect } from "../redux";
import { emailCheck } from "../utils";

export class Login extends Page {
  state = { login: true, username: "", password: "", rememberMe: true };
  async componentDidMount() {
    await super.componentDidMount();
    if (this.props.Application.isAuthenticated())
      this.props.history.push(this.props.Application.defaultPath());
  }
  async onSubmit() {
    const { login, username, password, rememberMe } = this.state;
    if (login) {
      if (!username) {
        this.usernameInput.focus();
        return await this.props.notificationNotify({
          type: "error",
          message: "Please enter your email"
        });
      }
      if (!emailCheck(username)) {
        this.usernameInput.focus();
        return await this.props.notificationNotify({
          type: "error",
          message: "Please enter a valid email"
        });
      }
      if (!password) {
        this.passwordInput.focus();
        return await this.props.notificationNotify({
          type: "error",
          message: "Please enter your password"
        });
      }
      await this.props.api(this.props.apis.user.login, {
        username,
        password,
        rememberMe
      });
    } else {
      if (!username) {
        this.usernameInput.focus();
        return await this.props.notificationNotify({
          type: "error",
          message: "Please enter your email"
        });
      }
      if (!emailCheck(username)) {
        this.usernameInput.focus();
        return await this.props.notificationNotify({
          type: "error",
          message: "Please enter a valid email"
        });
      }
      if (!password) {
        this.passwordInput.focus();
        return await this.props.notificationNotify({
          type: "error",
          message: "Please enter your password"
        });
      }
      await this.props.api(this.props.apis.user.register, {
        username,
        password
      });
    }
    if (this.props.Application.isAuthenticated()) {
      const url =
        this.props.User.profile.preferences.homepage ||
        this.props.Application.defaultPath();
      this.props.history.push(url);
    }
  }
  renderRegister() {
    const { username, password } = this.state;
    return [
      <div className="fields-group" key="username">
        <input
          ref={e => (this.usernameInput = e)}
          type="text"
          value={username}
          placeholder="Email"
          onChange={e => this.setState({ username: e.target.value })}
          onKeyPress={e =>
            e.key === "Enter" ? this.passwordInput.focus() : false
          }
        />
      </div>,
      <div className="fields-group" key="password">
        <input
          ref={e => (this.passwordInput = e)}
          type="password"
          value={password}
          placeholder="Password"
          onChange={e => this.setState({ password: e.target.value })}
          onKeyPress={e => (e.key === "Enter" ? this.onSubmit() : false)}
        />
      </div>,
      <div className="actions" key="buttons">
        <Button
          label="Register"
          className="cyan uppercase"
          onClick={e => this.onSubmit()}
        />
      </div>
    ];
  }
  renderLogin() {
    const { username, password, rememberMe } = this.state;
    return [
      <div className="fields-group" key="username">
        <input
          ref={e => (this.usernameInput = e)}
          type="text"
          value={username}
          placeholder="Email"
          onChange={e => this.setState({ username: e.target.value })}
          onKeyPress={e =>
            e.key === "Enter" ? this.passwordInput.focus() : false
          }
        />
      </div>,
      <div className="fields-group" key="password">
        <input
          ref={e => (this.passwordInput = e)}
          type="password"
          value={password}
          placeholder="Password"
          onChange={e => this.setState({ password: e.target.value })}
          onKeyPress={e => (e.key === "Enter" ? this.onSubmit() : false)}
        />
      </div>,
      <div className="fields-group" key="rememberMe">
        <input
          type="checkbox"
          checked={rememberMe}
          onChange={e => this.setState({ rememberMe: !rememberMe })}
        />
        <label onClick={e => this.setState({ rememberMe: !rememberMe })}>
          Keep me signed in
        </label>
      </div>,
      <div className="actions" key="buttons">
        <Button
          label="Login"
          className="cyan uppercase"
          onClick={e => this.onSubmit()}
        />
      </div>,
      <div className="forget-password" key="forgot">
        Forget your password?
      </div>
    ];
  }
  renderForm() {
    const { login } = this.state;
    return (
      <form className="form form-login">
        <div className="tab-headers">
          <div
            className={`tab-header ${login ? "active" : ""}`}
            onClick={e => this.setState({ login: true })}
          >
            Sign In
          </div>
          <div
            className={`tab-header ${login ? "" : "active"}`}
            onClick={e => this.setState({ login: false })}
          >
            Sign Up
          </div>
        </div>
        <div className="tab-content">
          {login ? this.renderLogin() : this.renderRegister()}
        </div>
      </form>
    );
  }
  renderComponent() {
    return <div className="page page-login">{this.renderForm()}</div>;
  }
}

export default connect(Login);
