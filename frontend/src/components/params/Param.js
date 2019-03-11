import React, { Component } from "react";
import classNames from "classnames";

export class Param extends Component {
  render() {
    const { title, param } = this.props;
    const { name, description, required, type } = param;
    return (
      <div
        className={classNames(
          "bot-param",
          `bot-param-${type}`,
          this.props.className
        )}
      >
        {title !== false ? (
          <h4>
            {name}
            <span>{required ? " (*)" : ""}</span>
            <label>{description}</label>
          </h4>
        ) : null}
        {this.renderParam()}
      </div>
    );
  }
}

export default Param;
