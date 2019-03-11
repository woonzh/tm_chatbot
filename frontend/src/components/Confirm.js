import React from "react";

import Popup from "./Popup";
import { ButtonRounded } from "./core";

export class Confirm extends Popup {
  render() {
    const { confirm, children } = this.props;
    return (
      <div className="overlay">
        <div className="popup confirm-box">
          <div className="actions">
            <ButtonRounded
              icon="Check"
              title="Confirm"
              onClick={async e => {
                await confirm();
                await this.onClose();
              }}
            />
            <ButtonRounded icon="Close" title="Cancel" onClick={this.onClose} />
          </div>
          <div className="content">{children}</div>
        </div>
      </div>
    );
  }
}

export default Confirm;
