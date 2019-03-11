import React from "react";
import PropTypes from "prop-types";
import { Route } from "react-router-dom";

const PublicRoute = ({ component: Component, redux, actions, ...rest }) => (
  <Route {...rest} render={props => <Component {...props} />} />
);

PublicRoute.propTypes = {
  component: PropTypes.func.isRequired
};

export default PublicRoute;
