import React from "react";

import Cmp from "../../Cmp";

export class ParamValueRef extends Cmp {
  get items() {
    return [].merge(this.props.options || this.store.Product.detail.parameters);
  }
  renderOption(o, i) {
    return (
      <option key={i} value={o.parameter}>
        {o.name}
      </option>
    );
  }
  renderOptions() {
    const items = this.items;
    return items.map((o, i) => this.renderOption(o, i));
  }
  render() {
    const { props } = this;
    const items = this.items;
    const { placeholder, onChange, hiddenIfNoOption, value } = props;
    if (hiddenIfNoOption && (!items || !items.length)) return null;
    return (
      <select value={value || ""} onChange={onChange} className="selectfield">
        <option value="" className="placeholder">
          {placeholder || "Refer to"}
        </option>
        {this.renderOptions()}
      </select>
    );
  }
}

export default ParamValueRef;
