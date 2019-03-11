import React, { Component } from "react";

import { uploadFileToProduct } from "../../../utils";
import { Checkbox, Icon, Table } from "../../core";
import * as params from "../../params";

import ParamTypeSelect from "./ParamTypeSelect";

export const renderParam = (param, props) => {
  const pprops = {
    param,
    autosave: true,
    title: false,
    files: global.store.getState().Application.files,
    onUpload: uploadFileToProduct,
    onChange: (e, param) =>
      props.onParamChange(param, "value", e.target.value, e),
    root: `/api/v1/download/${global.store.getState().Product.detail.id}`,
    ...props
  };
  return React.createElement(
    params[`P${((param && param.type) || "string").ucfirst()}`],
    pprops
  );
};

const onParamChange = (item, field, value) =>
  global.actions.productChangeParameter({
    item,
    update: { [field]: value }
  });
const onParamRemove = item => global.actions.productRemoveParameter(item);
const columns = [
  {
    id: "name",
    label: "Name",
    render: (row, col, i, tbl) => (
      <input
        type="text"
        value={row.name || ""}
        placeholder="Name"
        onChange={e => tbl.props.onParamChange(row, "name", e.target.value)}
      />
    )
  },
  {
    id: "value",
    label: "Default Value",
    render: (row, col, i, tbl) =>
      renderParam(row, {
        onParamChange: tbl.props.onParamChange,
        atomic: tbl.props.atomic
      })
  },
  {
    id: "description",
    label: "Description",
    render: (row, col, i, tbl) => (
      <input
        type="text"
        value={row.description || ""}
        placeholder="Description"
        onChange={e =>
          tbl.props.onParamChange(row, "description", e.target.value)
        }
      />
    )
  },
  {
    id: "type",
    label: "Type",
    render: (row, col, i, tbl) => (
      <ParamTypeSelect
        value={row.type}
        onChange={e => tbl.props.onParamChange(row, "type", e.target.value)}
      />
    )
  },
  {
    id: "isOutput",
    label: "Public",
    render: (row, col, i, tbl) => (
      <Checkbox
        checked={row.isOutput ? true : false}
        onChange={(e, v) => tbl.props.onParamChange(row, "isOutput", v)}
      />
    )
  },
  {
    id: "required",
    label: "Required",
    render: (row, col, i, tbl) => (
      <Checkbox
        checked={row.required ? true : false}
        onChange={(e, v) => tbl.props.onParamChange(row, "required", v)}
      />
    )
  },
  {
    id: "actions",
    label: "",
    render: (row, col, i, tbl) => (
      <Icon
        icon="fas fa-trash-alt"
        onClick={e => tbl.props.onParamRemove(row)}
      />
    )
  }
];

export class Variables extends Component {
  get columns() {
    return columns.filter(o => !o.hidden);
  }
  get data() {
    if (this.props.parameters) return [].merge(this.props.parameters);
    const product = global.store.getState().Product.detail || {};
    return [].merge(product.parameters);
  }
  set atBottom(v) {
    this.table.atBottom = v;
  }
  set atTop(v) {
    this.table.atTop = v;
  }

  render() {
    return (
      <Table
        ref={e => (this.table = e)}
        className="bot-variables"
        height={this.props.height || 300}
        fixedHeader={true}
        notoolbar={true}
        nopagination={true}
        columns={this.columns}
        data={this.data}
        atomic={this.props.atomic}
        onParamChange={this.props.onParamChange || onParamChange}
        onParamRemove={this.props.onParamRemove || onParamRemove}
      />
    );
  }
}

export default Variables;
