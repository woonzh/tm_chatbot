import React from "react";
import { Button as MButton } from "@material-ui/core";
import classNames from "classnames";

import Component from "./Component";

export class Button extends Component {
  renderComponent() {
    const defaultProps = this.props;
    const { circle, transparent, nopadding, freecolor, onClick } = defaultProps;
    const { name, text, label, title, variant, disabled } = defaultProps;
    const {
      children,
      className,
      icon,
      iconName,
      image,
      small,
      component
    } = defaultProps;

    const btnIcon = icon || iconName;
    const btnName = name || text || label || "";

    return React.createElement(component || MButton, {
      disabled: disabled,
      variant: variant || "outlined",
      title: title,
      className: classNames(
        "btn button",
        circle ? "circle" : "",
        small ? "small" : "",
        transparent ? "transparent" : "",
        nopadding ? "nopadding" : "",
        freecolor ? "freecolor" : "",
        !btnName ? "no-name" : `btn-${btnName.replace(/\s/g, "-")}`,
        className
      ),
      onClick: onClick,
      children: [].merge(
        image ? <img key="image" src={image} alt={btnName} /> : null,
        btnIcon ? <i key="icon" className={btnIcon} /> : null,
        btnName ? (
          <span key="name" className="text">
            {btnName}
          </span>
        ) : null,
        children
      )
    });
  }
}

export default Button;
