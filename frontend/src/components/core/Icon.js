import React from "react";
import * as icons from "@material-ui/icons";
import classNames from "classnames";

import Component from "./Component";

export class Icon extends Component {
  state = {
    icon: this.props.icon,
    title: this.props.title,
    description: this.props.description,
    className: this.props.className
  };
  set icon(v) {
    this.setState({ icon: v });
  }
  set title(v) {
    this.setState({ title: v });
  }
  set description(v) {
    this.setState({ description: v });
  }
  set className(v) {
    this.setState({ className: v });
  }

  shouldComponentUpdate(nextProps, nextState) {
    nextState.icon = nextProps.icon;
    nextState.title = nextProps.title;
    nextState.description = nextProps.description;
    nextState.className = nextProps.className;
    return true;
  }

  renderComponent() {
    const { icon, title, description, className } = this.state;
    const { onClick } = this.props;
    const { small, big } = this.props;
    const isImage = /.+\.\w{1,5}$/g.test(icon);

    const classes = [small ? "small" : "", big ? "big" : "", className];

    return isImage ? (
      <img
        className={classNames("core-icon image-icon", ...classes)}
        src={icon}
        alt={title || description || ""}
        title={title || description || ""}
        onClick={onClick}
        onError={e => {
          if (this.props.onError) this.props.onError(e);
        }}
        onLoad={e => {
          if (this.props.onLoad) this.props.onLoad(e);
        }}
      />
    ) : icons[icon] ? (
      React.createElement(icons[icon], {
        title: title || description || "",
        className: classNames("core-icon svg-icon", ...classes),
        onClick
      })
    ) : (
      <i
        className={classNames("core-icon font-icon", icon, ...classes)}
        title={title || description || ""}
        onClick={onClick}
      />
    );
  }
}

export default Icon;
