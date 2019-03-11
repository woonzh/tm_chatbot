import React from "react";

import { Page } from "../components";

import { connect } from "../redux";

class Nifi extends Page {
  renderComponent() {
    return (
      <div className="page page-nifi">
        <iframe src="http://192.168.1.219:8080/nifi/" title="nifi" />
      </div>
    );
  }
}

export default connect(Nifi);
