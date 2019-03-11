import React from "react";
import { Page } from "../components";
import { connect } from "../redux";

import { Editor } from "../components";

export class Product extends Page {
  renderComponent() {
    return (
      <Editor id={this.props.match.params.id} history={this.props.history} />
    );
  }
}

export default connect(Product);
