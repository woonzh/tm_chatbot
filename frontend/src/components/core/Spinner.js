import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import classNames from "classnames";

import Component from "./Component";

export class Spinner extends Component {
  renderComponent() {
    const defaultProps = this.props;
    const { size, noOverlay, inside, className } = defaultProps;
    if (noOverlay)
      return (
        <CircularProgress
          size={size || 40}
          className={classNames("spinner", className)}
        />
      );
    return (
      <div className={classNames("overlay", inside ? "inside" : "", className)}>
        <CircularProgress size={size || 40} className="spinner" />
      </div>
    );
  }
}

export default Spinner;
