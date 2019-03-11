import React from "react";
import classNames from "classnames";
import { TextField as MTextField } from "@material-ui/core";

import Component from "./Component";

export class TextField extends Component {
  renderComponent() {
    const { props } = this;
    const { InputProps, autoFocus, InputLabelProps } = props;
    const { className, onEnter, value, small, big } = props;
    return (
      <MTextField
        {...props}
        fullWidth
        InputProps={{ ...InputProps, autoFocus }}
        InputLabelProps={{ ...InputLabelProps, shrink: true }}
        value={value || ""}
        className={classNames(
          "inputfield",
          "textfield",
          small ? "small" : "",
          big ? "big" : "",
          className
        )}
        onKeyPress={e => {
          if (e.key === "Enter") {
            e.preventDefault();
            if (onEnter) onEnter(e);
          }
        }}
      />
    );
  }
}

export default TextField;
