import React from "react";
import classNames from "classnames";

import Component from "./Component";

export class Form extends Component {
  renderComponent() {
    const attrs = ["id", "name", "action", "method", "autocomplete"] //
      .merge(["accept-charset", "target", "enctype", "novalidate"]);

    const { props } = this;
    const cmpProps = {};
    attrs.map(
      o => (props.hasOwnProperty(o) ? (cmpProps[o] = props[o]) : false)
    );
    const { className, children } = props;
    return (
      <form {...cmpProps} className={classNames("form", className)}>
        {children}
      </form>
    );
  }
}

export default Form;
