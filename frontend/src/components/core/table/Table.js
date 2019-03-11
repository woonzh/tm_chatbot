import React from "react";
import PropTypes from "prop-types";
import { Table as MTable, TableBody, TableCell } from "@material-ui/core";
import { TablePagination, TableRow } from "@material-ui/core";
import { Paper } from "@material-ui/core";

import theme from "../../../theme";

import Checkbox from "../Checkbox";
import Component from "../Component";

import TableHead from "./TableHead";
import TableToolbar from "./TableToolbar";

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

function tableSort(data, cmp) {
  const stabilizedThis = data.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === "desc"
    ? (a, b) => desc(a, b, orderBy)
    : (a, b) => -desc(a, b, orderBy);
}

function tableSearch(data, cols, s) {
  if (!s) return data;
  if (!cols || !cols.length) return data;
  return data.filter(row => {
    const text = cols
      .map((c, i) => (c.render ? c.render.call(this, row, c, i) : row[c.id]))
      .join(" ");
    return text.includes(s);
  });
}

class Table extends Component {
  static propTypes = {
    columns: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired,
    title: PropTypes.string,
    total: PropTypes.number,
    pageSize: PropTypes.number,
    page: PropTypes.number,
    order: PropTypes.string,
    orderBy: PropTypes.string,
    actions: PropTypes.array,
    searchcols: PropTypes.array,
    searchable: PropTypes.bool,
    search: PropTypes.string,
    showCheckbox: PropTypes.bool,
    fixedHeader: PropTypes.bool,
    onChangePage: PropTypes.func,
    onChangePageSize: PropTypes.func,
    onSearch: PropTypes.func,
    onSelectAll: PropTypes.func,
    onSort: PropTypes.func,
    onRowClick: PropTypes.func
  };
  get data() {
    const { searchcols, data } = this.props;
    const { search } = this.state;
    return tableSearch.bind(this)(data, searchcols, search);
  }
  get columns() {
    return [].concat(this.props.columns).filter(o => o);
  }
  set atBottom(v) {
    if (v) this.wrapper.scrollTop = this.wrapper.scrollHeight;
  }
  set atTop(v) {
    if (v) this.wrapper.scrollTop = 0;
  }

  state = {
    page: this.props.page || 0,
    selected: this.props.selected || [],
    search: this.props.search || "",
    searchable: this.props.searchable,
    showCheckbox: this.props.showCheckbox,
    order: this.props.order || "desc",
    orderBy: this.props.orderBy,
    title: this.props.title,
    pageSize: this.props.pageSize || 15
  };

  onSort = property => {
    const { orderBy, order } = this.state;
    const { onSort } = this.props;
    if (orderBy === property && order === "desc")
      this.setState({ order: "asc", orderBy: property }, () => {
        if (onSort) onSort(this.state);
      });
    else
      this.setState({ order: "desc", orderBy: property }, () => {
        if (onSort) onSort(this.state);
      });
  };
  onSelectAll = e => {
    if (e.target.checked) {
      this.setState(state => ({ selected: state.data.map(n => n.id) }));
      return;
    }
    this.setState({ selected: [] });
  };
  onRowClick = (e, id) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    this.setState({ selected: newSelected }, () => {
      if (this.props.onRowClick) this.props.onRowClick(this.state);
    });
  };
  onChangePage = (e, page) =>
    this.setState({ page }, () => {
      if (this.props.onChangePage) this.props.onChangePage(this.state);
    });
  onChangePageSize = e =>
    this.setState({ pageSize: e.target.value }, () => {
      if (this.props.onChangePageSize) this.props.onChangePageSize(this.state);
    });
  onSearch = async e =>
    this.setState({ search: e.target.value }, async () => {
      if (this.props.onSearch) await this.props.onSearch(this.state, e);
    });
  isSelected = id => this.state.selected.indexOf(id) !== -1;
  renderCell(row, c, i) {
    return (
      <TableCell key={i} {...Object.omit(c, "numeric", "render")}>
        {c.render ? c.render.call(this, row, c, i, this) : row[c.id]}
      </TableCell>
    );
  }
  renderCells(row) {
    const { columns } = this;
    return columns.map((o, i) => this.renderCell(row, o, i));
  }
  renderComponent() {
    const { data, columns, props, state, onChangePageSize } = this;
    const { onSearch, onSelectAll, onSort, onChangePage } = this;
    const { total, actions, notoolbar, nopagination } = props;
    const { fixedHeader, height } = props;
    const { wrapperStyle, tableStyle, tableHeadStyle } = props;
    const { order, orderBy, pageSize, page, showCheckbox } = state;
    const rowCount = total || data.length;
    const emptyRows = pageSize - Math.min(pageSize, rowCount - page * pageSize);
    return (
      <Paper
        style={{ ...theme.tableRoot, height: fixedHeader ? "100%" : "initial" }}
        className={`table-container ${this.props.className || ""}`}
      >
        {notoolbar === true ? null : (
          <TableToolbar {...state} onSearch={onSearch} actions={actions} />
        )}
        <div
          ref={e => (this.wrapper = e)}
          style={{
            ...theme.tableWrapper,
            ...wrapperStyle,
            height: fixedHeader ? height || "100%" : "initial"
          }}
        >
          <MTable
            style={{ ...theme.table, ...tableStyle }}
            className={`table ${fixedHeader ? "fixed" : ""}`}
          >
            <TableHead
              {...state}
              fixedHeader={fixedHeader}
              data={data}
              columns={columns}
              onSelectAll={onSelectAll}
              onSort={onSort}
              rowCount={rowCount}
              className={`table-head ${fixedHeader ? "fixed" : ""}`}
              style={tableHeadStyle}
            />
            <TableBody className="table-body">
              {tableSort(data, getSorting(order, orderBy))
                .slice(page * pageSize, page * pageSize + pageSize)
                .map((n, i) => {
                  const isSelected = this.isSelected(n.id);
                  return (
                    <TableRow
                      hover
                      onClick={e => this.onRowClick(e, n.id)}
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={n.id || i}
                      selected={isSelected}
                      style={theme.tableRow}
                    >
                      {showCheckbox ? (
                        <TableCell>
                          <Checkbox
                            style={theme.tableCheckbox}
                            checked={isSelected}
                          />
                        </TableCell>
                      ) : null}
                      {this.renderCells(n)}
                    </TableRow>
                  );
                })}
              {nopagination !== true && emptyRows > 0 && (
                <TableRow
                  style={{
                    ...theme.tableRow,
                    height: theme.tableRowHeight * emptyRows
                  }}
                >
                  <TableCell
                    colSpan={columns.length + (showCheckbox ? 1 : 0)}
                  />
                </TableRow>
              )}
            </TableBody>
          </MTable>
        </div>
        {nopagination === true ? null : (
          <TablePagination
            className="table-pagination"
            rowsPerPageOptions={[5, 10, 15]}
            component="div"
            count={rowCount}
            rowsPerPage={pageSize}
            page={page}
            backIconButtonProps={{
              "aria-label": "Previous Page"
            }}
            nextIconButtonProps={{
              "aria-label": "Next Page"
            }}
            onChangePage={onChangePage}
            onChangeRowsPerPage={onChangePageSize}
          />
        )}
      </Paper>
    );
  }
}

export default Table;
