import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const styles = {
  mainContainer: {
    fontSize: "12px",
    borderBottom: "2px solid #5D5D5D",
    margin: "15px 0",
    lineHeight: "14px"
  },
  user: {
    color: "#437b76",
    float: "left",
    fontWeight: "bold"
  },
  timestamp: {
    color: "#999999",
    float: "right",
    marginRight: "5px"
  },
  content: {
    textAlign: "left",
    margin: "10px 0px",
    float: "left",
    width: "80%"
  },
  emotion: {
    float: "right",
    margin: "8px 5px 8px 0px"
  }
};

export class Item extends Component {
  renderEmotion = () => {
    const { classes, item } = this.props;
    if (item.sentiment === "Positive") {
      return (
        <div className={classes.emotion}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="#2ABC61"
          >
            <circle cx="15.5" cy="9.5" r="1.5" />
            <circle cx="8.5" cy="9.5" r="1.5" />
            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-4c-1.48 0-2.75-.81-3.45-2H6.88c.8 2.05 2.79 3.5 5.12 3.5s4.32-1.45 5.12-3.5h-1.67c-.7 1.19-1.97 2-3.45 2z" />
          </svg>
        </div>
      );
    } else if (item.sentiment === "Negative") {
      return (
        <div className={classes.emotion}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="#FB0204"
          >
            <circle cx="15.5" cy="9.5" r="1.5" />
            <circle cx="8.5" cy="9.5" r="1.5" />
            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-6c-2.33 0-4.32 1.45-5.12 3.5h1.67c.69-1.19 1.97-2 3.45-2s2.75.81 3.45 2h1.67c-.8-2.05-2.79-3.5-5.12-3.5z" />
          </svg>
        </div>
      );
    } else {
      return (
        <div className={classes.emotion}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="#F2D308"
          >
            <path d="M9 14h6v1.5H9z" />
            <circle cx="15.5" cy="9.5" r="1.5" />
            <circle cx="8.5" cy="9.5" r="1.5" />
            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
          </svg>
        </div>
      );
    }
  };
  render() {
    const { classes, item } = this.props;
    const d = new Date(item.timestamp);
    return (
      <div className={classes.mainContainer}>
        <div>
          <span className={classes.user}>{item.user}</span>
          <span className={classes.timestamp}>
            {d.toLocaleTimeString([], {
              timeZone: "UTC",
              hour: "2-digit",
              minute: "2-digit"
            })}
          </span>
        </div>
        <div style={{ clear: "both" }} />
        <div className={classes.content}>{item.text}</div>
        {this.renderEmotion()}
        <div style={{ clear: "both" }} />
      </div>
    );
  }
}
export default withStyles(styles)(Item);
