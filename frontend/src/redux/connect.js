import { connect } from "react-redux";
import { withRouter } from "react-router";
import { compose } from "redux";
import { withStyles } from "@material-ui/core";

import theme from "../theme";

import stateToProps from "./stateToProps";
import actions from "./actions";

export default function(cmp, router = false, styles = theme) {
  const args = [
    connect(
      stateToProps,
      actions
    )
  ];
  if (styles !== false) args.push(withStyles(styles, { withTheme: true }));
  if (router) args.push(withRouter);
  return compose(...args)(cmp);
}
