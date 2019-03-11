import React from "react";
import { Page } from "../components";
import { connect } from "../redux";

export class Dashboard extends Page {
  state = {};

  renderComponent() {
    return (
      <div className="page page-dashboard">Dashboard - under development</div>
    );
  }
}

export default connect(Dashboard);
