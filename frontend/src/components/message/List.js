import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import MessageItem from "./Item";
const styles = {
  title: {
    textAlign: "left",
    fontSize: "14px",
    color: "#FBD304",
    fontWeight: "bold"
  }
};
export class List extends Component {
  renderItems = () => {
    let { lists } = this.props;
    return lists.reduce((accu, item) => {
      accu.push(<MessageItem key={item.id} item={item} />);
      return accu;
    }, []);
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <div className={classes.title}>{this.props.title}</div>
        <div className="messageList">{this.renderItems()}</div>
      </div>
    );
  }
}

export default withStyles(styles)(List);
