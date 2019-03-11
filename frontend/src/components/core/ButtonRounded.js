import React from "react";
import classNames from "classnames";
import { IconButton, Tooltip } from "@material-ui/core";

import Component from "./Component";
import Icon from "./Icon";

export class ButtonRounded extends Component {
  renderComponent() {
    const { disabled, icon, title, label, onClick, className } = this.props;
    return disabled ? (
      <IconButton aria-label={label || title} disabled={disabled}>
        <Icon icon={icon} />
      </IconButton>
    ) : (
      <Tooltip
        title={title || label}
        className={classNames("btn-rounded", className)}
      >
        <IconButton aria-label={label || title} onClick={onClick}>
          <Icon icon={icon} />
        </IconButton>
      </Tooltip>
    );
  }
}

export default ButtonRounded;
