import React, { Component } from "react";
import classNames from "classnames";

import { Select, MenuItem } from "@material-ui/core";
import { TextField } from "./core";

export class Field extends Component {
  focus = e => this.input.focus();
  blur = e => this.input.blur();
  render() {
    const { props } = this;
    const { placeholder, required, label, type, multiple, readonly } = props;
    const { value, defaultValue, onChange, autoComplete, options } = props;
    const { className } = props;
    const renderFieldLabel = () => (
      <label className="field-label">{required ? `${label}(*)` : label}</label>
    );
    const fieldProps = {
      autoComplete: autoComplete,
      onChange: onChange,
      value: value,
      className: type === "select" ? "selectfield" : "inputfield"
    };
    return (
      <div
        className={classNames(
          "field",
          type === "select" ? "select-field" : "input-field",
          className
        )}
      >
        {renderFieldLabel()}
        <div className="field-value">
          {readonly ? (
            value || defaultValue
          ) : type === "select" ? (
            <Select
              {...fieldProps}
              multiple={multiple ? true : false}
              inputRef={e => (this.input = e)}
            >
              {[].merge(options).map((opt, j) => (
                <MenuItem key={j} value={opt.value}>
                  {opt.text}
                </MenuItem>
              ))}
            </Select>
          ) : (
            <TextField
              {...fieldProps}
              type={type || "text"}
              inputRef={e => (this.input = e)}
              placeholder={placeholder || label}
            />
          )}
        </div>
      </div>
    );
  }
}

export default Field;
