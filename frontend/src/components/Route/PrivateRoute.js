import React from "react";
import PropTypes from "prop-types";
import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({ component: Component, redux, actions, ...rest }) => {
  const { User, Application } = redux;
  const isAuthenticated = Application.isAuthenticated();
  const renderRedirect = pathname => (
    <Route
      {...rest}
      render={props => (
        <Redirect
          to={{
            pathname,
            state: { from: props.location }
          }}
        />
      )}
    />
  );
  if (!isAuthenticated) return renderRedirect("/login");
  let denied = false;
  if (actions && actions.length) denied = !User.hasOneOfActions(...actions);
  if (denied) return renderRedirect(Application.defaultPath());
  return <Route {...rest} render={props => <Component {...props} />} />;
};

PrivateRoute.propTypes = {
  component: PropTypes.func.isRequired
};

export default PrivateRoute;
