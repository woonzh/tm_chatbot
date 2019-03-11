import React from "react";

import Param from "./Param";

export class PNumber extends Param {
  renderParam() {
    const { param, onChange } = this.props;
    const { name, value, description, required } = param;
    return (
      <input
        className="textfield"
        type="number"
        value={value || ""}
        placeholder={description || name}
        onChange={e => onChange(e, param)}
        required={required}
      />
    );
  }
}

export default PNumber;
