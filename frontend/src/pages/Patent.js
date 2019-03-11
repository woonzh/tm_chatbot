import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "../redux";
const styles = {};
export class Patent extends Component {
  constructor(props) {
    super(props);
    this.loadData();
  }
  loadData = () => {
    return fetch(this.props.apis.demo.loadpattern.url, {
      method: "GET"
    })
      .then(response => response.json())
      .then(responseData => {
        console.log(responseData);
      });
  };
  render() {
    return <div>test</div>;
  }
}

export default withStyles(styles)(connect(Patent));
