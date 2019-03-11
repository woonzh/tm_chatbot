import React, { Component } from "react";

import { connect } from "../redux";

class Utilities extends Component {
  render() {
    return (
      <div className="page page-products">
        <div className="products">
          <div class="product new-product">
            <button
              class="MuiButtonBase-root-47 MuiButton-root-81 MuiButton-outlined-89 btn button no-name btn-new-project"
              tabindex="0"
              type="button"
            >
              <span class="MuiButton-label-82">Text Annotation Tool</span>
              <span class="MuiTouchRipple-root-74" />
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(Utilities);
