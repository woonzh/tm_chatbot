import React, { Component } from "react";
import { Link } from "react-router-dom";

import { connect } from "../redux";

export class Logo extends Component {
  render() {
    const { name, shortname, logo } = this.props.Application;
    const fullname = `${name} (${shortname})`;
    return (
      <Link key="logo" to={this.props.Application.defaultPath()}>
        <div className="logo">
          <img src={logo} alt={fullname} />
        </div>
      </Link>
    );
  }
}
export default connect(Logo);
