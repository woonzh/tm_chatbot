import React from "react";

import Param from "./Param";

export class PEmail extends Param {
  renderParam() {
    const { param, onChange } = this.props;
    const { name, value, description, required } = param;
    return (
      <input
        key="p-email"
        className="textfield"
        type="email"
        value={value || ""}
        placeholder={description || name}
        onChange={e => onChange(e, param)}
        required={required}
      />
    );
  }
}

export default PEmail;
