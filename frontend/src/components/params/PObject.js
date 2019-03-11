import React from "react";
import { Chip } from "@material-ui/core";

import Param from "./Param";

export class PObject extends Param {
  state = { value: {} };

  componentDidMount() {
    try {
      this.setState({ value: JSON.parse(this.props.param.value) });
    } catch (e) {}
  }

  onChange() {
    const { param, onChange } = this.props;
    onChange({ target: { value: JSON.stringify(this.state.value) } }, param);
  }

  renderItem(o, i) {
    const { value } = this.state;
    return (
      <Chip
        key={i}
        label={`"${o}": "${value[o] || "null"}"`}
        className="item"
        onDelete={e => {
          const { value } = this.state;
          delete value[o];
          this.setState({ value }, () => this.onChange());
        }}
      />
    );
  }
  renderItems() {
    const { value } = this.state;
    return (
      <div key="items" className="items">
        {Object.keys(value).map((o, i) => this.renderItem(o, i))}
      </div>
    );
  }
  renderParam() {
    return [
      <div key="input" className="horizontal">
        <input
          ref={e => (this.keyInput = e)}
          className="textfield textfield-key"
          type="text"
          placeholder="New key"
          required={true}
          onKeyPress={e => {
            if (e.key === "Enter") {
              e.preventDefault();
              this.valueInput.focus();
            }
          }}
        />
        <input
          ref={e => (this.valueInput = e)}
          className="textfield"
          type="text"
          placeholder="value, (enter to add)"
          onKeyPress={e => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (!this.keyInput.value) {
                this.keyInput.focus();
              } else {
                const { value } = this.state;
                value[this.keyInput.value] = this.valueInput.value;
                this.setState({ value }, () => this.onChange());
                this.keyInput.value = "";
                this.valueInput.value = "";
                this.keyInput.focus();
              }
            }
          }}
        />
      </div>,
      this.renderItems()
    ];
  }
}

export default PObject;
