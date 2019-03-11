import React from "react";
import { Page, Button } from "../components";
import { connect } from "../redux";

export class Preferences extends Page {
  renderComponent() {
    return (
      <div className="page page-preferences">
        <h3>
          <Button transparent freecolor icon="fas fa-cog" />
          Preferences
        </h3>
        <div className="page-content" />
      </div>
    );
  }
}

export default connect(Preferences);
