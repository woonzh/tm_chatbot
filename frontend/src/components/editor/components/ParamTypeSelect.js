import React from "react";

import Cmp from "../../Cmp";

export class ParamTypeSelect extends Cmp {
  render() {
    const { dataTypes } = this.store.Application;
    const { value, onChange } = this.props;
    return (
      <select value={value} onChange={onChange}>
        {dataTypes.map(o => (
          <option value={o.value} key={o.value}>
            {o.name}
          </option>
        ))}
      </select>
    );
  }
}

export default ParamTypeSelect;
