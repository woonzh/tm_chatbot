import React, { Component } from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { Toolbar, Typography } from "@material-ui/core";

import theme from "../../../theme";

import ButtonRounded from "../ButtonRounded";

export class TableToolbar extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    searchable: PropTypes.bool.isRequired,
    selected: PropTypes.array.isRequired
  };
  render() {
    const { selected, title, searchable, search } = this.props;
    const numSelected = selected.length;
    if (!numSelected) return null;
    return (
      <Toolbar
        className="table-toolbar"
        style={{
          ...theme.tableToolbar,
          [theme.tableToolbarHighlight]: numSelected > 0
        }}
      >
        {numSelected > 0 ? (
          <Typography style={theme.tableToolbarTitleSelected}>
            {numSelected} selected
          </Typography>
        ) : searchable ? (
          <input
            type="text"
            value={search}
            style={theme.tableSearchField}
            className={classNames("table-searchfield")}
            placeholder={`Search for ${title}`}
            onChange={e => this.props.onSearch(e)}
          />
        ) : (
          <Typography style={theme.tableToolbarTitle}>{title}</Typography>
        )}
        <div style={theme.tableToolbarActions}>
          {numSelected > 0 ? (
            <ButtonRounded title="Delete" icon="Delete" />
          ) : (
            this.props.actions
          )}
        </div>
      </Toolbar>
    );
  }
}

export default TableToolbar;
