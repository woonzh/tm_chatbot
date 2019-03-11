import React from "react";

import { Page } from "../components";

import { connect } from "../redux";

class Applications extends Page {
  renderComponent() {
    return (
      <div className="page page-cdap">
        <iframe src="http://192.168.1.219:11011/cdap/ns/default" title="cdap" />
      </div>
    );
  }
}

export default connect(Applications);
