import React, { Component } from "react";
import { Link } from "react-router-dom";

import { connect } from "../redux";

import { Button } from "./core";

export class UserProfile extends Component {
  render() {
    return (
      <div className="user-profile">
        <Link to="/profile">
          <Button
            transparent
            freecolor
            icon="fas fa-user"
            title={`User Profile`}
          />
        </Link>
      </div>
    );
  }
}

export default connect(UserProfile);
