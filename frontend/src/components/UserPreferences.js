import React, { Component } from "react";
import { Link } from "react-router-dom";

import { connect } from "../redux";

import { Button } from "./core";

export class UserPreferences extends Component {
  render() {
    return (
      <div className="user-preferences">
        <Link to="/preferences">
          <Button
            transparent
            freecolor
            icon="fas fa-cog"
            title="User Preferences"
          />
        </Link>
      </div>
    );
  }
}

export default connect(UserPreferences);
