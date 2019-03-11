import React from "react";
import classNames from "classnames";
import { Checkbox as MCheckbox, Radio as MRadio } from "@material-ui/core";

import Component from "./Component";

export class Checkbox extends Component {
  renderComponent() {
    const { props } = this;
    const { radio, className } = props;
    return radio ? (
      <MRadio
        {...Object.omit(props, "radio")}
        className={classNames("checkbox radiofield", className)}
      />
    ) : (
      <MCheckbox
        {...Object.omit(props, "radio")}
        className={classNames("checkbox checkboxfield", className)}
      />
    );
  }
}

export default Checkbox;
