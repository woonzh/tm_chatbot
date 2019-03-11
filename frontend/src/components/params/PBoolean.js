import React from "react";

import Param from "./Param";

export class PBoolean extends Param {
  renderParam() {
    const { param, onChange } = this.props;
    const { name, value, description } = param;
    return (
      <select
        className="textfield"
        type="text"
        value={value || ""}
        placeholder={description || name}
        onChange={e => onChange(e, param)}
      >
        <option value={"true"}>True</option>
        <option value={""}>False</option>
      </select>
    );
  }
}

export default PBoolean;
