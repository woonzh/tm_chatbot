import React, { Component } from "react";
import PropTypes from "prop-types";
import { TableCell, TableHead as MTableHead } from "@material-ui/core";
import { TableRow, TableSortLabel } from "@material-ui/core";
import { Tooltip } from "@material-ui/core";

import theme from "../../../theme";

import Checkbox from "../Checkbox";

export class TableHead extends Component {
  static propTypes = {
    columns: PropTypes.array.isRequired,
    showCheckbox: PropTypes.bool,
    onSelectAll: PropTypes.func,
    orderBy: PropTypes.string,
    order: PropTypes.string,
    selected: PropTypes.array,
    rowCount: PropTypes.number,
    onSort: PropTypes.func
  };
  createSortHandler = property => e => this.props.onSort(property);

  get cellStyle() {
    const { fixedHeader } = this.props;
    return fixedHeader ? { position: "sticky", top: 0, zIndex: 4 } : {};
  }
  renderCell(col, i) {
    const { orderBy, order } = this.props;
    const { id, numeric, label, sortable } = col;
    return (
      <TableCell
        style={this.cellStyle}
        {...Object.omit(col, "numeric", "render")}
        key={id}
        sortDirection={orderBy === id ? order : false}
      >
        {sortable === true ? (
          <Tooltip
            title="Sort"
            placement={numeric ? "bottom-end" : "bottom-start"}
            enterDelay={300}
          >
            <TableSortLabel
              active={orderBy === id}
              direction={order}
              onClick={this.createSortHandler(id)}
            >
              {label}
            </TableSortLabel>
          </Tooltip>
        ) : (
          label
        )}
      </TableCell>
    );
  }
  render() {
    const { showCheckbox, onSelectAll, style, className } = this.props;
    const { selected, rowCount, columns } = this.props;
    const numSelected = selected.length;
    return (
      <MTableHead className={className}>
        <TableRow style={{ ...theme.tableHeadRow, ...style }}>
          {showCheckbox ? (
            <TableCell style={this.cellStyle}>
              <Checkbox
                style={theme.tableCheckbox}
                indeterminate={numSelected > 0 && numSelected < rowCount}
                checked={numSelected === rowCount}
                onChange={onSelectAll}
              />
            </TableCell>
          ) : null}
          {columns.map((o, i) => this.renderCell(o, i))}
        </TableRow>
      </MTableHead>
    );
  }
}

export default TableHead;
