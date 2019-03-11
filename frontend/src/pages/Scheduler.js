import React from "react";
import { InputAdornment } from "@material-ui/core";
import Search from "@material-ui/icons/Search";

import { Page, TextField, TextFieldOutlined } from "../components";
import { connect } from "../redux";

export class Scheduler extends Page {
  state = {};

  renderHeader = () => {
    return <h3>Scheduler</h3>;
  };
  renderSearchFilter = () => {
    return (
      <TextField
        id="textarea-project-name"
        placeholder="New project"
        value="Search Process or Project Name"
        InputProps={{
          endAdornment: <InputAdornment position="end">X</InputAdornment>
        }}
      />
    );
  };
  renderComponent() {
    return (
      <div className="page page-scheduler">
        {this.renderHeader()}
        {this.renderSearchFilter()}
        <TextFieldOutlined {...Search} />
      </div>
    );
  }
}

export default connect(Scheduler);
