import React, { Component } from "react";
import classNames from "classnames";

export class Hexagon extends Component {
  render() {
    return (
      <div className={classNames("hexagon", this.props.className)}>
        <div className="hexagon-shape" />
        <div className="hexagon-background" style={this.props.style} />
        {this.props.children}
      </div>
    );
  }
}
export default Hexagon;
