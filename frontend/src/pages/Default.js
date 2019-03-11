import React from "react";
import { Page } from "../components";
import { connect } from "../redux";

export class Default extends Page {
  renderComponent() {
    return <div className="page page-default">Not Found</div>;
  }
}

export default connect(Default);
