import React, { Component } from "react";
import { Tabs, Tab } from "@material-ui/core";
import classNames from "classnames";

import { connect } from "../../../redux";

import { Button, Spinner, TextField } from "../../core";

import { renderParam } from "./Variables";
import ParamValueRef from "./ParamValueRef";

const styles = theme => ({
  input: { color: "white" },
  tabs: {},
  tab: {
    minWidth: "auto"
  }
});

export class TabContainer extends Component {
  render() {
    const { dir, children, className, style } = this.props;
    return (
      <div dir={dir} className={className} style={style}>
        {children}
      </div>
    );
  }
}
export class NodeProperty extends Component {
  state = { tabindex: 0 };
  get inputs() {
    return this.props.PropertyPanel.items;
  }
  get outputs() {
    return this.props.PropertyPanel.outputs;
  }
  get variables() {
    return [].merge(this.props.Product.detail.parameters);
  }
  ////////
  componentDidMount() {
    global.jQuery(".main-content").addClass("show-node-properties");
  }
  componentWillUnmount() {
    global.jQuery(".main-content").removeClass("show-node-properties");
  }
  toggleContent = () => {
    const { jQuery } = global;
    jQuery(this.panel).toggleClass("hide");
    jQuery(this.panel.closest(".main-content")).toggleClass(
      "show-node-properties"
    );
  };
  ////////
  onParamValueChange = async (p, value, e) => {
    await this.props.propertyPanelUpdateParameter({
      item: p,
      value,
      valueRef: null
    });
    await this.onSave();
  };
  onParamValueRefChange = async (p, valueRef) => {
    const ref = this.variables.find(o => o.id === valueRef);
    await this.props.propertyPanelUpdateParameter({
      item: p,
      valueRef: ref ? valueRef : "",
      value: ref ? ref.value : p.value
    });
    await this.onSave();
  };
  onSave = async () => {
    const node = this.props.PropertyPanel.node;
    const parameters = this.props.PropertyPanel.items;
    const outputs = this.props.PropertyPanel.outputs.filter(o => o.param);
    await this.props.api(this.props.apis.product.updateValues, {
      parameters,
      nospinner: true,
      path: [node.id]
    });
    await this.props.api(this.props.apis.product.updateOutputs, {
      outputs,
      nospinner: true,
      path: [node.id]
    });
  };
  addOutput() {
    this.props.propertyPanelAddOutput({
      param: null,
      value: "",
      valueRef: ""
    });
  }

  renderInput(item, i) {
    const { name, description, value, valueRef } = item;
    const ref = !valueRef ? null : this.variables.find(o => o.id === valueRef);
    return (
      <form key={i} className="form parameter">
        <h4>
          {name}
          <ParamValueRef
            label="Reference"
            value={valueRef}
            hiddenIfNoOption
            onChange={e => this.onParamValueRefChange(item, e.target.value)}
          />
        </h4>
        {description ? (
          <div className="description">{description.ucfirst()}</div>
        ) : null}
        <div className="value-wrapper">
          {renderParam(ref || item, {
            value,
            autosave: false,
            files: this.props.Application.files,
            onChange: e => this.onParamValueChange(item, e.target.value, e)
          })}
        </div>
      </form>
    );
  }
  renderInputs(items) {
    if (!items) return;
    return items.map((o, i) => this.renderInput(o, i));
  }

  renderTabs() {
    const { classes } = this.props;
    return (
      <Tabs
        key="tabs"
        value={this.state.tabindex}
        onChange={(e, v) => this.setState({ tabindex: v })}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
        className={classNames(classes.tabs, "tabs")}
      >
        <Tab label="Input" className={classNames(classes.tab, "tab")} />
        <Tab
          label={
            <div className="tab-label">
              Output
              <Button
                circle
                small
                component="div"
                title="Add output"
                icon="fas fa-plus"
                onClick={e => this.addOutput()}
              />
            </div>
          }
          className={classNames(classes.tab, "tab")}
        />
      </Tabs>
    );
  }
  renderTabContainers() {
    const { tabindex } = this.state;
    return (
      <div key="tabcontainers" className="tab-containers">
        <TabContainer className="tab-container">
          {tabindex === 0
            ? this.renderInputTabContent()
            : this.renderOutputTabContent()}
        </TabContainer>
      </div>
    );
  }
  renderInputTabContent() {
    return this.renderInputs(this.inputs);
  }
  renderOutputTabContent() {
    return <div className="outputs">{this.renderOutputs(this.outputs)}</div>;
  }
  renderOutputs(outputs) {
    if (!outputs) return null;
    return outputs.map((o, i) => this.renderOutput(o, i));
  }
  renderOutput(item, i) {
    const { param, valueRef, value } = item;
    return (
      <div className="form output" key={i}>
        <div className="horizontal center top">
          <ParamValueRef
            label="Output to"
            placeholder="Select a variable"
            value={param}
            options={this.variables.filter(o => o.isOutput)}
            onChange={e =>
              this.props.propertyPanelUpdateOutput({
                item,
                update: { param: e.target.value }
              })
            }
          />
          <Button
            circle
            small
            icon="fas fa-trash"
            onClick={e => this.props.propertyPanelRemoveOutput(item)}
          />
        </div>
        <ParamValueRef
          label="Value from"
          placeholder="Select an input"
          value={valueRef}
          options={this.inputs}
          onChange={e =>
            this.props.propertyPanelUpdateOutput({
              item,
              update: { valueRef: e.target.value }
            })
          }
        />
        <TextField
          type="text"
          label="Or value as"
          value={value}
          onChange={e =>
            this.props.propertyPanelUpdateOutput({
              item,
              update: {
                value: e.target.value
              }
            })
          }
        />
      </div>
    );
  }
  renderPanelContent() {
    const { node, loading } = this.props.PropertyPanel;
    const { name, description } = node;

    if (loading)
      return [
        <h3 key="name">{name}</h3>,
        <div key="description" className="description">
          {(description || name).ucfirst()}
        </div>,
        this.renderTabs(),
        <Spinner inside key="spinner" />
      ];
    return [
      <h3 key="name">{name}</h3>,
      <div key="description" className="description">
        {(description || name).ucfirst()}
      </div>,
      this.renderTabs(),
      this.renderTabContainers()
    ];
  }
  render() {
    return (
      <div className="property-panel" ref={e => (this.panel = e)}>
        <div className="handle" onClick={e => this.toggleContent()}>
          Properties
        </div>
        <div className="panel-content">{this.renderPanelContent()}</div>
      </div>
    );
  }
}

export default connect(
  NodeProperty,
  true,
  styles
);
