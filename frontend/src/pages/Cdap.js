import React from "react";

import { Page } from "../components";

import { connect } from "../redux";

class Cdap extends Page {
  renderComponent() {
    return (
      <div className="page page-cdap">
        <iframe
          src="http://amarisai-server4.com.sg:11011/cdap/ns/default"
          title="cdap"
        />
      </div>
    );
  }
}

export default connect(Cdap);
