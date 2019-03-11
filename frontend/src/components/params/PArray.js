import React from "react";
import { Chip } from "@material-ui/core";

import Param from "./Param";

export class PArray extends Param {
  state = {
    items: `${this.props.param.value || ""}`.split(",").filter(o => o)
  };

  onChange() {
    const { param, onChange } = this.props;
    onChange({ target: { value: this.state.items.join(",") } }, param);
  }

  renderItem(o, i) {
    return (
      <Chip
        key={i}
        label={o}
        className="item"
        onDelete={e => {
          const { items } = this.state;
          items.splice(items.indexOf(o), 1);
          this.setState({ items }, () => this.onChange());
        }}
      />
    );
  }
  renderItems() {
    const { items } = this.state;
    return (
      <div key="items" className="items">
        {items.map((o, i) => this.renderItem(o, i))}
      </div>
    );
  }
  renderParam() {
    const { param } = this.props;
    const { name, description } = param;
    return [
      <input
        key="input"
        className="textfield"
        type="text"
        placeholder={`${description || name}, (enter to add)`}
        onKeyPress={e => {
          if (e.key === "Enter") {
            e.preventDefault();
            this.setState(
              { items: [...this.state.items, e.target.value] },
              () => this.onChange()
            );
            e.target.value = "";
          }
        }}
      />,
      this.renderItems()
    ];
  }
}

export default PArray;
